import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { formatIndianNumber } from "../utils/formatIndianNumber";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [newCurrentBid, setNewCurrentBid] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/view/${id}`, {
          withCredentials: true,
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
    if (!newCurrentBid) return;
    try {
      const response = await axios.put(
        `http://localhost:5555/update/${id}`,
        { newCurrentBid },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      
      const updatedListing = await axios.get(`http://localhost:5555/view/${id}`, {
        withCredentials: true,
      });
      setListing(updatedListing.data);
      setNewCurrentBid(""); // Clear input on success
    } catch (error) {
      console.error("Error updating bid:", error);
      setMessage("Failed to update bid.");
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
        </div>
    );
  }

  if (!listing) {
    return (
        <div className="pt-24 text-center">
            <h2 className="text-xl text-gray-600">Listing not found.</h2>
        </div>
    );
  }

  const isActive = new Date(listing.endDate) > new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                 <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                 <p className="text-sm text-gray-500 mt-1">Listing ID: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700">{id}</span></p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {isActive ? '● Active' : '● Closed'}
            </span>
        </div>

        {/* Main Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{formatIndianNumber(listing.price)}</p>
                </div>
                <div className="p-6">
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900">₹{formatIndianNumber(listing.currentBid)}</p>
                </div>
                <div className="p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
                    <p className="text-lg font-medium text-gray-700">{listing.startDate ? new Date(listing.startDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">End Date</p>
                    <p className="text-lg font-medium text-gray-700">{listing.endDate ? new Date(listing.endDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Members List */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                        <h2 className="text-lg font-bold text-gray-900">Member Status</h2>
                    </div>
                    
                    <div className="p-6">
                        {listing.members && listing.members.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Share</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                        {(() => {
                                            // Group members by name
                                            const memberGroups = {};
                                            listing.members.forEach(member => {
                                                if (memberGroups[member.name]) {
                                                    memberGroups[member.name].count++;
                                                } else {
                                                    memberGroups[member.name] = {
                                                        name: member.name,
                                                        phone: member.phone,
                                                        count: 1
                                                    };
                                                }
                                            });
                                            
                                            const bidShare = (listing.price - listing.currentBid) / listing.members.length;
                                            
                                            return Object.values(memberGroups).map((memberGroup, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 mr-3 text-xs">
                                                                {memberGroup.name.charAt(0)}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-900">{memberGroup.name}</span>
                                                                    {memberGroup.count > 1 && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
                                                                            {memberGroup.count}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">{memberGroup.phone}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-indigo-600">
                                                        ₹{formatIndianNumber(bidShare * memberGroup.count, 2)}
                                                    </td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
                                No members assigned to this listing.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Update Bid Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Update Bid
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newCurrentBid" className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                                Enter New Bid Amount
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    id="newCurrentBid"
                                    value={newCurrentBid}
                                    onChange={(e) => setNewCurrentBid(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="0.00"
                                    min={listing.currentBid ? listing.currentBid + 1 : 0}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Must be higher than current bid.</p>
                        </div>

                        <button
                            onClick={handleBidUpdate}
                            disabled={!newCurrentBid}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
                                ${newCurrentBid ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            Submit Update
                        </button>

                         {message && (
                            <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.toLowerCase().includes("failed") || message.toLowerCase().includes("error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>

             
                

            </div>
        </div>

      </div>
    </div>
  );
};

export default ListingDetail;
