import React, { useEffect, useState } from "react";
import axios from "axios";

const MembersWithListings = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/members", {
          withCredentials: true,
        });
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members with listings:", error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-24 container mx-auto p-4">
      <h1 className="text-3xl mb-4">Members and Their Listings</h1>
      <div className="space-y-4">
        {members.map((memberWithListings, idx) => (
          <div key={idx} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">
              {memberWithListings.member.name} (Phone:{" "}
              {memberWithListings.member.phone})
            </h2>

            <h3 className="text-lg mt-2">Listings:</h3>
            <ul className="list-disc pl-6">
              {memberWithListings.findlisting.length > 0 ? (
                memberWithListings.findlisting.map((listing, index) => (
                  <li key={index}>
                    <strong>Start Date:</strong>{" "}
                    {new Date(listing.startDate).toLocaleDateString()} <br />
                    <strong>Price:</strong> &#8377;{listing.price} <br />
                    <strong>Count:</strong> {listing.count} <br />
                    <strong>Current Bid Price:</strong> &#8377;
                    {listing.currentBidPrice}
                  </li>
                ))
              ) : (
                <li>No active listings</li>
              )}
            </ul>
            <div className="mt-2 text-lg font-bold">
              Total Bid Price: &#8377;{memberWithListings.totalBidPrice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersWithListings;
