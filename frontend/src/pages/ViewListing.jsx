import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatIndianNumber } from "../utils/formatIndianNumber";
import { getDemoUser } from "../utils/auth";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, a-z, z-a
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:5555/view", {
          withCredentials: true,
        });
        let fetchedListings = response.data.data || [];

        if (getDemoUser()) {
            fetchedListings = [...fetchedListings, ...mockListings];
        }

        setListings(fetchedListings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (getDemoUser()) {
            setListings(mockListings);
             setLoading(false);
        } else {
             setError("Failed to load listings");
             setLoading(false);
        }
      }
    };

    fetchListings();
  }, []);

  const getSortedListings = () => {
      const sorted = [...listings];

      console.log(sorted);
      switch (sortBy) {
          case "newest":
              // Sort by startDate descending
              return sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          case "oldest":
               // Sort by startDate ascending
              return sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        case "a-z": 
            return sorted.sort((a, b) => a.price - b.price);

        // Highest Price first (Descending)
        case "z-a":
            return sorted.sort((a, b) => b.price - a.price);
          default:
              return sorted;
      }
  };

  const sortedListings = getSortedListings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-700 text-lg font-semibold bg-red-100 px-6 py-3 rounded-lg shadow-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Listings
            </h1>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-500 pl-2">Sort by:</span>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer bg-transparent"
                >
                    <option value="newest">Date (Newest)</option>
                    <option value="oldest">Date (Oldest)</option>
                    <option value="a-z">Price (Low to High)</option>
                    <option value="z-a">Price (High to Low)</option>
                </select>
            </div>
        </div>

        {sortedListings && sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedListings.map((listing) => (
              <Link to={`/view/${listing._id}`} key={listing._id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden group h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {listing.title}
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-500">Price</span>
                        <span className="font-bold text-gray-900">₹{formatIndianNumber(listing.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-500">Start Date</span>
                        <span>{new Date(listing.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-500">End Date</span>
                        <span>{new Date(listing.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="font-medium text-gray-500">Month</span>
                         <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                            {listing.currentMonth || 1}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                     <span className="text-xs font-medium text-gray-500 group-hover:text-indigo-600">View Details</span>
                     <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl p-12 shadow-sm border border-gray-200 max-w-lg mx-auto mt-8">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active listings</h3>
            <p className="text-gray-500 mb-6">Create your first chit fund listing to get started.</p>
            <button
              onClick={() => navigate("/create")}
              className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
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
