import { useEffect, useState } from "react";
import axios from "axios";
import { formatIndianNumber } from "../utils/formatIndianNumber";
import { getDemoUser } from "../utils/auth";

const MembersWithListings = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, bid-high
  const [filterStatus, setFilterStatus] = useState("active"); // active, inactive

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/members", {
          withCredentials: true,
        });
        let fetchedMembers = response.data || [];
        
        if (getDemoUser()) {
            fetchedMembers = [...fetchedMembers, ...mockMembers];
        }

        setMembers(fetchedMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members with listings:", error);
        if (getDemoUser()) {
            setMembers(mockMembers);
        }
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getSortedMembers = () => {
    // 1. Filter first
    const filtered = members.filter(member => {
        if (filterStatus === "active") return member.findlisting.length > 0;
        if (filterStatus === "inactive") return member.findlisting.length === 0;
        return true;
    });

    // 2. Then Sort
    const sorted = [...filtered];
    switch (sortBy) {
        case "name-asc":
            return sorted.sort((a, b) => a.member.name.localeCompare(b.member.name));
        case "name-desc":
            return sorted.sort((a, b) => b.member.name.localeCompare(a.member.name));
        case "bid-high":
            return sorted.sort((a, b) => (b.totalBidPrice || 0) - (a.totalBidPrice || 0));
        default:
            return sorted;
    }
  };

  const visibleMembers = getSortedMembers();


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Members Directory
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 {/* Filter Toggle */}
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button
                        onClick={() => setFilterStatus("active")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilterStatus("inactive")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === "inactive" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Inactive
                    </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-medium text-gray-500 pl-2">Sort by:</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer bg-transparent outline-none"
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="bid-high">Total Bid Value (High-Low)</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {visibleMembers.map((memberWithListings, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border ${filterStatus === 'active' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {memberWithListings.member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{memberWithListings.member.name}</h2>
                                <p className="text-xs text-gray-500 font-mono">{memberWithListings.member.phone}</p>
                            </div>
                        </div>
                        {filterStatus === 'active' && (
                            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">Total Pay:</span>
                                <span className="text-sm font-bold text-indigo-700">
                                    ₹{formatIndianNumber(memberWithListings.findlisting.reduce((acc, listing) => acc + (listing.count * listing.currentBidPrice), 0))}
                                </span>
                            </div>
                        )}
                        {filterStatus === 'inactive' && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Inactive
                            </span>
                        )}
                    </div>

                    <div className="p-6">
                         {memberWithListings.findlisting.length > 0 ? (
                             <>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Active Listings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {memberWithListings.findlisting.map((listing, index) => (
                                        <div key={index} className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-sm">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-500">Total Price:</span>
                                                <span className="font-medium">₹{formatIndianNumber(listing.price)}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-500">Current Bid:</span>
                                                <span className="font-medium text-emerald-600">₹{listing.currentBidPrice}</span>
                                            </div>
                                             <div className="flex justify-between">
                                                <span className="text-gray-500">Count:</span>
                                                <span className="font-medium bg-white px-2 rounded border border-gray-200">{listing.count}</span>
                                            </div>
                                             <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-400 text-right">
                                                Started: {new Date(listing.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </>
                        ) : (
                            <div className="flex items-center justify-center py-4 text-gray-400 text-sm italic">
                                <span className="flex items-center gap-2">
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                     </svg>
                                    No active listings
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {visibleMembers.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">No {filterStatus} members found</p>
                    <p className="text-sm text-gray-500">Try changing the filter or create new members.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MembersWithListings;
