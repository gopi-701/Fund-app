import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:5555/view", {
          withCredentials: true,
        });
        setListings(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load listings");
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">
            Loading listings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-rose-100">
        <p className="text-red-700 text-lg font-semibold bg-red-100 px-6 py-3 rounded-lg shadow-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center tracking-tight">
          Your Listings
        </h1>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link to={`/view/${listing._id}`} key={listing._id}>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 line-clamp-2">
                    {listing.title}
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-medium text-gray-800">Price:</span>{" "}
                      ₹{listing.price.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Start:</span>{" "}
                      {new Date(listing.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">End:</span>{" "}
                      {new Date(listing.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Current Month:
                      </span>{" "}
                      {listing.currentMonth}
                    </p>
                  </div>
                  <div className="mt-6">
                    <span className="inline-block bg-sky-100 text-sky-800 text-sm font-medium px-4 py-1.5 rounded-full">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl p-10 shadow-lg max-w-xl mx-auto">
            <p className="text-gray-700 text-lg font-medium mb-4">
              No listings found. Create your first listing today!
            </p>
            <button
              onClick={() => navigate("/create")}
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewListings;
