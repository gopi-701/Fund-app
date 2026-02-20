import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateListing = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [members, setMembers] = useState([]);

  // Quick Options Constants
  const titleOptions = [
    "One Lakh only",
    "Two Lakhs only",
    "Three Lakhs only",
    "Five Lakhs only",
  ];

  const priceOptions = [
    { label: "1,00,000", value: 100000 },
    { label: "2,00,000", value: 200000 },
    { label: "3,00,000", value: 300000 },
    { label: "5,00,000", value: 500000 },
  ];

  const durationOptions = [
    { label: "10 Months", months: 10 },
    { label: "20 Months", months: 20 },
  ];

  // Helper to generate Start Date options (5-day intervals)
  const getStartDateOptions = () => {
    const options = [];
    const today = new Date();
    // Start checking from tomorrow to give generous next options
    let current = new Date(today);
    current.setDate(current.getDate() + 1);

    while (options.length < 5) {
      const day = current.getDate();
      if (day % 5 === 0) {
        options.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return options;
  };

  const startDateOptions = getStartDateOptions();

  // Helper to calculate End Date
  const handleDurationClick = (months) => {
    if (!startDate) {
      alert("Please select a Start Date first.");
      return;
    }
    const start = new Date(startDate);
    
    // Note: setMonth handles year rollover automatically
    start.setMonth(start.getMonth() + (months - 1));
    
    // Format YYYY-MM-DD
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    const dd = String(start.getDate()).padStart(2, "0");
    setEndDate(`${yyyy}-${mm}-${dd}`);
  };

  // Helper to format Date object to YYYY-MM-DD for input value
  const formatDateToInput = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
  };
  
  // Helper to format Date object to DD/MM/YYYY for display label
  const formatDateToDisplay = (date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
  }


  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const generateMembers = () => {
      const count = parseInt(memberCount);
      if (!count || count <= 0) {
          alert("Please enter a valid number of members");
          return;
      }
      // Generate new array of members
      const newMembers = Array.from({ length: count }, () => ({ name: "", phone: "" }));
      setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !price ||
      !startDate ||
      !endDate ||
      members.length === 0 ||
      members.some((member) => !member.name || !member.phone)
    ) {
      alert("Please fill in all details");
      console.log("Please fill in all details");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5555/create",
        {
          title,
          price,
          startDate,
          endDate,
          members,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Got response");

      if (response.status === 201) {
        alert("Listing created successfully!");
        setTitle("");
        setPrice("");
        setStartDate("");
        setEndDate("");
        setMemberCount("");
        setMembers([]);
        navigate('/view');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] p-4 lg:p-8 pt-20">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-[#1F2937] mb-6 text-center">
          Create a New Listing
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-lg">
          
          {/* Top Row: Title, Price, Start Date, End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Title Section */}
            <div className="flex flex-col">
                <label htmlFor="title" className="block text-sm font-medium text-[#1F2937] mb-1">Title</label>
                <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors bg-[#F8F8FF]"
                placeholder="Title"
                />
                <div className="mt-1 flex flex-wrap gap-1">
                    {titleOptions.map((opt) => (
                        <button key={opt} type="button" onClick={() => setTitle(opt)} className="px-2 py-0.5 text-[10px] font-medium text-[#7C3AED] bg-[#F3E8FF] rounded-full hover:bg-[#E9D5FF] border border-[#D8B4FE]">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col">
                <label htmlFor="price" className="block text-sm font-medium text-[#1F2937] mb-1">Price</label>
                <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors bg-[#F8F8FF]"
                min="0"
                placeholder="Price"
                />
                <div className="mt-1 flex flex-wrap gap-1">
                    {priceOptions.map((opt) => (
                        <button key={opt.label} type="button" onClick={() => setPrice(opt.value)} className="px-2 py-0.5 text-[10px] font-medium text-[#7C3AED] bg-[#F3E8FF] rounded-full hover:bg-[#E9D5FF] border border-[#D8B4FE]">
                            ₹{opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Date Section */}
            <div className="flex flex-col">
                <label htmlFor="startDate" className="block text-sm font-medium text-[#1F2937] mb-1">Start Date</label>
                <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors bg-[#F8F8FF]"
                />
                <div className="mt-1 flex flex-wrap gap-1">
                    {startDateOptions.map((date, idx) => (
                        <button key={idx} type="button" onClick={() => setStartDate(formatDateToInput(date))} className="px-2 py-0.5 text-[10px] font-medium text-[#7C3AED] bg-[#F3E8FF] rounded-full hover:bg-[#E9D5FF] border border-[#D8B4FE]">
                            {formatDateToDisplay(date)}
                        </button>
                    ))}
                </div>
            </div>

            {/* End Date Section */}
            <div className="flex flex-col">
                <label htmlFor="endDate" className="block text-sm font-medium text-[#1F2937] mb-1">End Date</label>
                <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors bg-[#F8F8FF]"
                />
                <div className="mt-1 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-gray-500">Calc:</span>
                    {durationOptions.map((opt) => (
                        <button key={opt.label} type="button" onClick={() => handleDurationClick(opt.months)} disabled={!startDate} title={!startDate ? "Select Start Date first" : ""} className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors border border-[#D8B4FE] ${!startDate ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-[#7C3AED] bg-[#F3E8FF] hover:bg-[#E9D5FF]' }`}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

          </div>

          <div className="border-t border-[#D8B4FE] my-6"></div>

          {/* Members Generation Section */}
          <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="w-full md:w-1/3">
                  <label htmlFor="memberCount" className="block text-sm font-medium text-[#1F2937] mb-2">Number of Members</label>
                  <input 
                      type="number" 
                      id="memberCount"
                      value={memberCount}
                      onChange={(e) => setMemberCount(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors bg-[#F8F8FF]"
                      placeholder="e.g. 10"
                      min="1"
                  />
              </div>
              <button
                  type="button"
                  onClick={generateMembers}
                  className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] focus:ring-2 focus:ring-[#7C3AED] focus:ring-opacity-50 font-medium transition-colors"
                >
                  Generate
              </button>
          </div>

          {/* Members Grid (Left & Right) */}
          {members.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {members.map((member, index) => (
                   <div key={index} className="flex gap-4 items-start p-3 border border-[#D8B4FE] rounded-lg bg-[#F3E8FF] hover:shadow-sm transition-shadow">
                        <span className="text-gray-500 font-bold mt-2 top-0 text-sm">#{index + 1}</span>
                        <div className="flex-1 space-y-2">
                             <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                required
                                className="w-full px-3 py-1.5 text-sm border border-[#D8B4FE] rounded focus:ring-1 focus:ring-[#7C3AED] bg-white"
                                placeholder="Name"
                             />
                             <input
                                type="text"
                                value={member.phone}
                                onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                                required
                                className="w-full px-3 py-1.5 text-sm border border-[#D8B4FE] rounded focus:ring-1 focus:ring-[#7C3AED] bg-white"
                                placeholder="Phone"
                             />
                        </div>
                   </div>
                ))}
             </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-[#7C3AED] text-white py-3 px-4 rounded-lg hover:bg-[#6D28D9] focus:ring-2 focus:ring-[#7C3AED] focus:ring-opacity-50 font-bold text-lg transition-colors duration-200 shadow-md transform hover:scale-[1.01]"
              
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
