import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { formatIndianNumber } from "../utils/formatIndianNumber";
import { getDemoUser } from "../utils/auth";

const DashboardAnalytics = () => {
  const [listings, setListings] = useState([]);
  const [archivedListings, setArchivedListings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, archivedRes, membersRes] = await Promise.all([
          axios.get("http://localhost:5555/view", { withCredentials: true }),
          axios.get("http://localhost:5555/archived", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5555/members", { withCredentials: true }),
        ]);

        let fetchedListings = listingsRes.data.data || [];
        let fetchedArchived = archivedRes.data || [];
        let fetchedMembers = membersRes.data || [];

        if (getDemoUser()) {
          fetchedListings = [...fetchedListings, ...mockListings];
          fetchedMembers = [...fetchedMembers, ...mockMembers];
        }

        setListings(fetchedListings);
        setArchivedListings(fetchedArchived);
        setMembers(fetchedMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        // Even on error, if demo user, show mock data
        if (getDemoUser()) {
          setListings(mockListings);
          setMembers(mockMembers);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Stats Calculation
  // Total chits includes both active and archived
  const totalChitsRun = listings.length + archivedListings.length;

  // Calculate active chits (chits where end date is in the future)
  const activeChits = listings.filter(
    (listing) => new Date(listing.endDate) > new Date(),
  ).length;

  // Calculate current value (sum of current bids instead of prices)
  const currentValue = listings.reduce(
    (acc, curr) => acc + (curr.currentBid || curr.price),
    0,
  );

  // Calculate total potential value (sum of all prices)
  const totalPotentialValue = listings.reduce(
    (acc, curr) => acc + curr.price,
    0,
  );

  // Calculate average bid amount
  const averageBidAmount =
    listings.length > 0
      ? listings.reduce((acc, curr) => acc + (curr.currentBid || 0), 0) /
        listings.length
      : 0;

  // Active members count
  const activeMembersCount = members.length;

  // Total investment by all members
  const totalInvestment = members.reduce((acc, member) => {
    return (
      acc +
      member.findlisting.reduce(
        (sum, listing) => sum + listing.count * listing.currentBidPrice,
        0,
      )
    );
  }, 0);

  // 2. Pie Chart Data: Distribution of Chits by Amount
  const chitsByAmount = listings.reduce((acc, curr) => {
    const priceLabel = `₹${(curr.price / 100000).toFixed(1)}L`; // e.g., 2.0L
    acc[priceLabel] = (acc[priceLabel] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(chitsByAmount).map((key) => ({
    name: key,
    value: chitsByAmount[key],
  }));

  // 3. Highlight: Top Investor (Member with Highest Investment)
  let topInvestor = null;
  let maxInvestment = -1;

  members.forEach((m) => {
    // Calculate total investment for this member
    const totalMemberInvestment = m.findlisting.reduce(
      (acc, l) => acc + l.count * l.currentBidPrice,
      0,
    );

    if (totalMemberInvestment > maxInvestment) {
      maxInvestment = totalMemberInvestment;
      topInvestor = {
        ...m.member,
        totalInvestment: totalMemberInvestment,
        totalChits: m.findlisting.reduce((acc, l) => acc + l.count, 0),
      };
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard Overview
        </h1>

        {/* Stats Cards - 2 rows, 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Row 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Total Chits Run
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {totalChitsRun}
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Active Chits
                </div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {activeChits}
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Current Value
                </div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">
                  ₹{formatIndianNumber(currentValue)}
                </div>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Total Potential
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-2">
                  ₹{formatIndianNumber(totalPotentialValue)}
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Avg Bid Amount
                </div>
                <div className="text-2xl font-bold text-orange-600 mt-2">
                  ₹{formatIndianNumber(averageBidAmount)}
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Active Members
                </div>
                <div className="text-3xl font-bold text-teal-600 mt-2">
                  {activeMembersCount}
                </div>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Charts Section */}
          {pieData.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Chit Distribution (By Value)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Investor Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-xl shadow-lg text-white">
            <h2 className="text-xl font-bold mb-6 border-b border-indigo-400 pb-2">
              💎 Top Investor
            </h2>
            {topInvestor ? (
              <div className="space-y-4">
                <div>
                  <div className="text-indigo-200 text-sm uppercase font-semibold">
                    Highest Investment
                  </div>
                  <div className="text-3xl font-extrabold mt-1">
                    {topInvestor.name}
                  </div>
                  <div className="text-indigo-100 text-sm font-mono mt-1">
                    {topInvestor.phone}
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100 font-medium">
                      Total Investment:
                    </span>
                    <span className="text-2xl font-bold">
                      ₹{formatIndianNumber(topInvestor.totalInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/20">
                    <span className="text-indigo-100 font-medium">
                      Chits Held:
                    </span>
                    <span className="text-xl font-bold">
                      {topInvestor.totalChits}
                    </span>
                  </div>
                </div>
                <Link
                  to="/members"
                  className="inline-block mt-4 text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View All Members &rarr;
                </Link>
              </div>
            ) : (
              <p className="text-indigo-100">No data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
