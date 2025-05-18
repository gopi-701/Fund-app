import listing from "../models/listing.model.js";
import Member from "../models/members.model.js";

// Fetch all active listings for authenticated users or guests
export const viewAllListing = async (req, res) => {
  try {
    // Check if the user is authenticated by verifying the request object for `req.user`
    const userId = req.user._id; // If authenticated, get userId, else null for guest
    // console.log(userId);
    // If user is logged in, filter listings by userId
    const query = userId
      ? { userId, endDate: { $gt: Date.now() } } // Show only active listings for logged-in users
      : { endDate: { $gt: Date.now() } }; // Show active listings for guests

    // Fetch listings based on the query above
    const activeListings = await listing.find(query);

    if (activeListings.length === 0) {
      return res.status(200).json({ message: "No active listings found" });
    }

    return res.status(200).json({
      count: activeListings.length,
      data: activeListings,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to load listings" });
  }
};

// Create a new listing (only accessible by authenticated users)

export const createListing = async (req, res) => {
  try {
    // console.log("check 0");
    const { title, price, startDate, endDate, members } = req.body;
    const userId = req.user._id;
    // console.log(userId);
    let memberIds = [];
    // console.log("check 1");

    // Loop through each member in the request body
    for (const memberData of members) {
      // console.log("subcheck1");

      // Check if a member with the same phone number already exists for the user
      let existingMember = await Member.findOne({
        userId,
        phone: memberData.phone,
      });

      // console.log("subcheck2");

      // If the member doesn't exist, create a new one
      if (!existingMember) {
        // console.log("subcheck3");
        const newMember = new Member({
          userId,
          name: memberData.name,
          phone: memberData.phone,
          calculatedBidPrice: 0,
        });

        // Save the new member
        existingMember = await newMember.save();
        // console.log("subcheck4");
      }

      // Add the member's ObjectId to the memberIds array
      memberIds.push(existingMember._id);
    }

    // console.log("check2");

    const d = new Date();
    let startDate1 = new Date(startDate);
    let currentMonth =
      d.getMonth() -
      startDate1.getMonth() +
      12 * (d.getFullYear() - startDate1.getFullYear());

    // console.log("here is the problem3");

    // Create the listing and reference the member ObjectIds
    const newListing = new listing({
      title,
      price,
      startDate,
      currentMonth,
      endDate,
      members: memberIds,
      userId,
    });

    // Save the listing
    const savedListing = await newListing.save();

    // Return the saved listing in the response
    res.status(201).json(savedListing);
  } catch (error) {
    console.error(error);
    // Handle the error properly by returning a response with status 500
    res.status(500).json({ error: "Failed to create listing" });
  }
};

// View a single listing by ID
export const viewListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the listing by ID and populate the members field
    const findListing = await listing.findById(id).populate("members");

    if (!findListing) {
      return res
        .status(404)
        .json({ message: "The listing you are looking for doesn't exist" });
    }

    return res.status(201).json(findListing);
  } catch (error) {
    console.error("Error fetching listing:", error.message);
    res.status(500).send({ message: error.message });
  }
};

// Archive listings whose endDate has passed
export const archived = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log("this is updated1");
    const archivedListings = await listing.find({
      userId,
      endDate: { $lte: new Date() }, // Find listings where endDate has passed
    });
    // console.log("this is updated2");

    // Set currentMonth to null for archived listings
    const updatedListings = archivedListings.map((listing) => ({
      ...listing._doc, // Spread the existing fields
      currentMonth: null, // Set currentMonth to null
    }));

    if (!updatedListings.length) {
      // console.log("this is updated inside if");
      return res.status(200).json([]); // Return empty array if no archived listings found
    }
    // console.log("this is updated", updatedListings);

    return res.status(200).json(updatedListings); // Return the modified array of listings
  } catch (error) {
    console.error("Error fetching archived listings:", error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update the listing with the new current bid (only accessible by authenticated users)
export const updateListingWithCurrentBid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { id } = req.params; // Listing ID from the route
    const { newCurrentBid } = req.body; // newCurrentBid from frontend input

    const findListing = await listing.findById(id).populate("members"); // Find the listing and populate members
    findListing.currentBid = 0;

    if (!findListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if the listing has expired
    if (Date.now() > findListing.endDate) {
      return res
        .status(400)
        .json({ message: "Listing has expired and cannot be updated" });
    }

    // Calculate the new bid price for each member
    const bidDifference =
      (findListing.price - newCurrentBid) / findListing.members.length;

    // Update the members' calculated bid prices
    await Promise.all(
      findListing.members.map(async (member) => {
        const updatedBidPrice = member.calculatedBidPrice + bidDifference;
        await Member.findByIdAndUpdate(member._id, {
          calculatedBidPrice: updatedBidPrice,
        });
      })
    );

    // Update the listing with the new current bid
    findListing.currentBid = newCurrentBid;
    findListing.lastUpdated = new Date(); // Update the last updated timestamp
    await findListing.save(); // Save the updated listing

    return res
      .status(200)
      .json({ message: "Listing and member bids updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a listing by ID (only accessible by authenticated users)
export const deleteListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const result = await listing.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Listing not found" });
    }
    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return res.json(500).send({ message: error.message });
  }
};
