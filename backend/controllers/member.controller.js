import listing from "../models/listing.model.js";
import Member from "../models/members.model.js";
// import member from "../models/members.model.js";
import { archived } from "./listing.controller.js";

export const createMember = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user._id;
    let findListing = await listing.find({ userId });

    let calculatedBidPrice = 0;

    for (let listing of findListing) {
      if (listing.endDate <= Date.now()) {
        calculatedBidPrice = calculatedBidPrice + listing.price;
        // console.log(listing.startDate);
        // console.log(listing.price);
        // console.log(calculatedBidPrice);
      }
    }
    const newMember = new Member({
      name,
      phone,
      calculatedBidPrice,
      userId,
    });
    // console.log(newMember);
    // console.log(calculatedBidPrice);
    // let savedMember = await newMember.save();
    // console.log(savedMember);
    return res.json({ message: "New Members Created!" });
  } catch (error) {
    // console.log(error);
    res.status(404).json(error, "cannot create new member");
  }
};

export const viewMemberWithListings = async (req, res) => {
  try {
    // Find all members
    const userId = req.user._id;

    const members = await Member.find({ userId });
    if (!members) {
      // console.log("unable to find users");
    }

    if (!members.length) {
      return res.status(404).json({ message: "No members found" });
    }

    let membersWithListings = [];

    // For each member, find their associated listings and calculate the bid share
    for (let member of members) {
      const findlisting = await listing
        .find({
          userId,
          members: member._id,
          endDate: { $gte: new Date() }, // Exclude listings where endDate has passed
        })
        .populate("members") // Populate the members field to access the array length
        .select("price startDate currentBid members"); // Only show required fields

      let totalBidPrice = 0; // Initialize total bid price for the member

      // Calculate the share for each listing for that member
      let listingsWithShare = findlisting.map((listings) => {
        // Count how many times the member appears in the listing
        const memberCount = listings.members.filter(
          (m) =>
            m.name.toString() === member.name.toString() &&
            m.phone === member.phone
        ).length;

        let currentBidPrice;
        // Calculate the bid share for this member in this listing
        if (
          (listing.currentBid && listings.price && listings.members.length) !=
            0 ||
          (listing.currentBid && listings.price && listings.members.length) !=
            NaN
        ) {
          const individualBidShare =
            (listings.price - listings.currentBid) / listings.members.length;

          // Multiply by memberCount to account for multiple appearances in the same listing
          currentBidPrice = individualBidShare * memberCount;
        } else {
          currentBidPrice = 0;
        }

        // Add to total bid price for the member
        totalBidPrice += currentBidPrice;

        return {
          startDate: listings.startDate,
          price: listings.price,
          currentBidPrice: currentBidPrice.toFixed(2), // Share rounded to 2 decimal places
          count: memberCount, // Number of times the member appears in this listing
        };
      });

      membersWithListings.push({
        member: {
          name: member.name,
          phone: member.phone,
        },
        findlisting: listingsWithShare,
        totalBidPrice: totalBidPrice.toFixed(2), // Add the total bid price across listings
      });
    }

    return res.status(200).json(membersWithListings);
  } catch (error) {
    // console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

// export const checkListing = async (req, res) => {
//   try {
//     listing
//       .find({})
//       .populate("title")
//       .then((p) => console.log(p));
//     return res.json({ message: "jaenrfij" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// };
