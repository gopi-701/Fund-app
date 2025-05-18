import React, { useEffect, useState } from "react";
import axios from "axios";

const ArchivedListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch archived listings from the API
    axios
      .get("http://localhost:5555/archived", { withCredentials: true })
      .then((response) => {
        setListings(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load archived listings");
        setLoading(false);
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  if (loading) return <div>Loading archived listings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto my-8 mt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Archived Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="p-4 border-2 border-gray-300 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <p className="mt-2">Price: &#8377; {listing.price}</p>
            <p>
              Start Date: {new Date(listing.startDate).toLocaleDateString()}
            </p>
            <p>End Date: {new Date(listing.endDate).toLocaleDateString()}</p>
            {/* Display 'Archived' instead of currentMonth if it's null */}
            <p>
              Current Month:{" "}
              {listing.currentMonth !== null
                ? listing.currentMonth
                : "Archived"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivedListings;
