import mongoose, { Schema } from "mongoose";
import listing from "../models/listing.model.js";

const memberSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true }, // unique phone numbers per user
  calculatedBidPrice: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

memberSchema.index({ phone: 1, userId: 1 }, { unique: true });

const Member = mongoose.model("Member", memberSchema);
export default Member;
