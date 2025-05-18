import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema({
  title: { type: String },
  price: { type: Number },
  startDate: { type: Date },
  currentBid: { type: Number },
  currentMonth: { type: Number },
  endDate: { type: Date },
  lastUpdated: { type: Date },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const listing = mongoose.model("listing", listingSchema);
export default listing;
