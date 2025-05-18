import { useState } from "react";
import axios from "axios";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState([{ name: "", phone: "" }]);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: "", phone: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !price ||
      !startDate ||
      !endDate ||
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
        setMembers([{ name: "", phone: "" }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center py-8 pt-24">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F2937] mb-8 text-center sm:text-4xl">
          Create a New Listing
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
              placeholder="Enter listing title"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
              min="0"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
            />
          </div>

          <div className="border-t border-[#D8B4FE] pt-6">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
              Members
            </h3>
            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="p-4 border border-[#D8B4FE] rounded-lg bg-[#F3E8FF] space-y-3 transition-shadow duration-200 hover:shadow-md"
                >
                  <div>
                    <label
                      htmlFor={`member-name-${index}`}
                      className="block text-sm font-medium text-[#1F2937] mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id={`member-name-${index}`}
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
                      placeholder="Enter member name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`member-phone-${index}`}
                      className="block text-sm font-medium text-[#1F2937] mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id={`member-phone-${index}`}
                      value={member.phone}
                      onChange={(e) =>
                        handleMemberChange(index, "phone", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2.5 border border-[#D8B4FE] rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors duration-200 bg-[#F8F8FF]"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMember}
              className="mt-4 px-4 py-2 border border-[#7C3AED] rounded-lg text-sm font-medium text-[#7C3AED] bg-white hover:bg-[#F3E8FF] focus:ring-2 focus:ring-[#7C3AED] transition-colors duration-200"
            >
              Add Member
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#7C3AED] text-white py-3 px-4 rounded-lg hover:bg-[#6D28D9] focus:ring-2 focus:ring-[#7C3AED] focus:ring-opacity-50 font-semibold transition-colors duration-200"
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
