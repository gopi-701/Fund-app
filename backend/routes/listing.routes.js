import { Router } from "express";
import {
  archived,
  createListing,
  deleteListing,
  updateListingWithCurrentBid,
  viewAllListing,
  viewListing,
} from "../controllers/listing.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { viewMemberWithListings } from "../controllers/member.controller.js";

const router = Router();

// View all active listings (accessible for both authenticated and guest users)
router.route("/view").get(authenticateUser, viewAllListing);

// Create a new listing (only accessible for authenticated users)
router.route("/create").post(authenticateUser, createListing);

// View a specific listing
router.route("/view/:id").get(authenticateUser, viewListing);

// Get archived listings
router.route("/archived").get(authenticateUser, archived);

// Update listing with current bid (only for authenticated users)
router.route("/update/:id").put(authenticateUser, updateListingWithCurrentBid);

// Delete listing (only for authenticated users)
router.route("/delete/:id").delete(authenticateUser, deleteListing);
router.route("/members").get(authenticateUser, viewMemberWithListings);

export default router;
