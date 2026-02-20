import { useEffect, useState } from "react";
import axios from "axios";
import { formatIndianNumber } from "../utils/formatIndianNumber";

const ArchivedListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, a-z, z-a

  useEffect(() => {
    // Fetch archived listings from the API
    axios
      .get("http://localhost:5555/archived", { withCredentials: true })
      .then((response) => {
        setListings(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load archived listings");
        setLoading(false);
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  const getSortedListings = () => {
    const sorted = [...listings];
    switch (sortBy) {
        case "newest":
            return sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        case "oldest":
            return sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        case "a-z":
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case "z-a":
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
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
              Archived Listings
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
                    <option value="a-z">Title (A-Z)</option>
                    <option value="z-a">Title (Z-A)</option>
                </select>
            </div>
        </div>

        {sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col opacity-75 hover:opacity-100 transition-opacity"
              >
                 <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                            {listing.title}
                        </h2>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider rounded">Archived</span>
                    </div>
                    
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
                    </div>
                  </div>
              </div>
            ))}
          </div>
        ) : (
             <div className="text-center bg-white rounded-xl p-12 shadow-sm border border-gray-200 max-w-lg mx-auto mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No archived listings</h3>
                <p className="text-gray-500">Past listings will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedListings;
