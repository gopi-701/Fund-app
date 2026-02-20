import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const DashboardLayout = ({ children, user = { name: "User" } }) => {
  const location = useLocation();
  // Default to false (collapsed/icon-only) on desktop as requested
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Listings", path: "/view", icon: "📑" },
    { label: "Create Listing", path: "/create", icon: "➕" },
    { label: "Archived", path: "/archived", icon: "📁" },
    { label: "Members", path: "/members", icon: "👥" },
  ];

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5555/logout", {
        withCredentials: true,
      });
      Cookies.remove("token");
      console.log(response.data);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.href = "/";
      }
    } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred while logging out.");
    }
  };

  // Close sidebar when an item is clicked (auto-collapse)
  const handleItemClick = () => {
      setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-30 shadow-sm">
        {/* Left: Sidebar Toggle & Brand Placeholder */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-100"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"> <Link to="/view">Chit Ease</Link></span>
        </div>

        {/* Right: User Profile & Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-4 focus:outline-none group"
            >
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 transition-colors group-hover:bg-gray-50 py-1 pr-1 rounded-l-full">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm group-hover:shadow-md transition-all">
                        {user.name.charAt(0)}
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">user@example.com</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Fixed Position */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out mt-16
            ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"} 
            overflow-hidden`}
        >
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 space-y-2 flex-1 w-64">
                {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleItemClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={!isSidebarOpen ? item.label : ""}
                >
                    <span className="text-lg">{item.icon}</span>
                    <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                        {item.label}
                    </span>
                </Link>
                ))}
            </div>
            
            {/* Bottom Actions - Settings instead of Logout */}
            <div className="p-4 border-t border-gray-100 w-64">
                <button
                    onClick={() => {/* Navigate to settings or open modal */ handleItemClick()}}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    title={!isSidebarOpen ? "Settings" : ""}
                >
                    <span className="text-lg">⚙️</span>
                    <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                        Settings
                    </span>
                </button>
             </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden mt-16"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content - Adjust margin based on sidebar state */}
        <main 
            className={`flex-1 overflow-auto bg-gray-50 p-4 transition-all duration-300
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
        >
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
