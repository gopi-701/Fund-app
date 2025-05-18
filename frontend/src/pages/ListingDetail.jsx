import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ListingDetail = () => {
  const { id } = useParams(); // Get listing ID from route
  const [listing, setListing] = useState(null);
  const [newCurrentBid, setNewCurrentBid] = useState(""); // For user input of new current bid
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const navigate = useNavigate(); // For navigation

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/view/${id}`, {
          withCredentials: true, // Ensure the token is sent with the request
        });

        setListing(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing details:", error);
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBidUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5555/update/${id}`,
        {
          newCurrentBid: newCurrentBid,
        },
        { withCredentials: true }
      );
      setMessage("this is", response.data.message);
      console.log("this is", response.data.message);
      // Re-fetch the listing to update the view with new data
      const updatedListing = await axios.get(
        `http://localhost:5555/view/${id}`,
        {
          withCredentials: true, // Ensure the token is sent with the request
        }
      );
      setListing(updatedListing.data);
    } catch (error) {
      console.error("Error updating bid:", error);
      setMessage("Failed to update bid.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className=" container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="pt-24 text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        Listing Details
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {listing.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6 text-gray-700">
          <p>
            <strong className="font-semibold text-gray-800">Price:</strong> ₹
            {listing.price?.toLocaleString()}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">
              Current Bid:
            </strong>{" "}
            ₹{listing.currentBid?.toFixed(2)}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Start Date:</strong>{" "}
            {listing.startDate
              ? new Date(listing.startDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">End Date:</strong>{" "}
            {listing.endDate
              ? new Date(listing.endDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Members:</h3>
          {listing.members && listing.members.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {listing.members.map((member, index) => {
                // Calculate bid share dynamically, handle potential division by zero
                const bidShare =
                  (listing.price - listing.currentBid) / listing.members.length;
                return (
                  <li key={index}>
                    {member.name} (Phone: {member.phone}) - Bid Share: ₹
                    {bidShare.toFixed(2)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">
              No members currently in this listing.
            </p>
          )}
        </div>

        {/* Only show the bid update form if the user is authenticated */}
        {/* Assume isAuthenticated is a prop or state managed outside this snippet */}
        {/* Example: { isAuthenticated && ( ... bid update form ... ) } */}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <label
            htmlFor="newCurrentBid"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Update Current Bid:
          </label>
          <input
            type="number"
            id="newCurrentBid"
            value={newCurrentBid}
            onChange={(e) => setNewCurrentBid(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            min={listing.currentBid ? listing.currentBid + 1 : 0}
          />
          <button
            onClick={handleBidUpdate}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:inline-block transition duration-150 ease-in-out"
          >
            Update Bid
          </button>
        </div>

        {/* Success or error message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ₹{
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {/* {message} */}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;
