import express from "express";
import {
  getUserSettings,
  updateUserSettings,
  resetUserSettings,
  getSettingsField,
  updateSettingsField,
} from "../controllers/settings.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all settings routes
router.use(verifyToken);

// Get all settings for a user
router.get("/:userId", getUserSettings);

// Update all settings for a user
router.put("/:userId", updateUserSettings);

// Reset settings to defaults
router.delete("/:userId", resetUserSettings);

// Get specific field from settings
router.get("/:userId/field/:field", getSettingsField);

// Update specific field in settings
router.patch("/:userId/field/:field", updateSettingsField);

export default router; 