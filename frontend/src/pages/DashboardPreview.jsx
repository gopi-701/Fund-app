import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { formatIndianNumber } from "../utils/formatIndianNumber";

// Mock data to simulate fetching listings
const MOCK_LISTINGS = [
  {
    _id: "1",
    title: "Premium Chit Fund Group A",
    price: 50000,
    startDate: "2024-01-01",
    endDate: "2024-12-01",
    currentMonth: 5,
  },
  {
    _id: "2",
    title: "Monthly Savings Scheme B",
    price: 25000,
    startDate: "2024-03-15",
    endDate: "2025-03-15",
    currentMonth: 3,
  },
  {
    _id: "3",
    title: "High Yield Chit C",
    price: 100000,
    startDate: "2023-11-01",
    endDate: "2024-11-01",
    currentMonth: 8,
  },
];

const DashboardPreview = () => {
  return (
    <DashboardLayout user={{ name: "Gopinath" }}>
      <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
           <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>

        {/* Stats Section (Optional Bonus) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total Listings</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Active Chits</p>
                <p className="text-3xl font-bold text-green-600 mt-2">5</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">₹1.75L</p>
            </div>
        </div>

        {/* Listings Grid (Mimicking ViewListing.jsx) */}
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Listings</h2>
                <Link to="/create" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                    + Create New
                </Link>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_LISTINGS.map((listing) => (
              <div key={listing._id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden cursor-pointer">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                     </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {listing.title}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                       <span>Price</span>
                       <span className="font-semibold text-gray-900">₹{formatIndianNumber(listing.price)}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Month</span>
                       <span className="font-semibold text-gray-900">{listing.currentMonth}/12</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details 
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPreview;
