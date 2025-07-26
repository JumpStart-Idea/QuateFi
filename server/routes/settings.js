import express from "express";
import {
  getUserSettings,
  updateUserSettings,
  resetUserSettings,
  getSettingsField,
  updateSettingsField,
  uploadProfilePicture,
  uploadDocuments,
  deleteDocument,
  getDocuments,
  downloadDocument,
} from "../controllers/settings.js";
import verifyToken from "../middleware/auth.js";
import { upload, handleUploadError } from "../middleware/upload.js";

const router = express.Router();

// Apply authentication middleware to all settings routes
router.use(verifyToken);

// Test route to verify settings routes are working
router.get("/test", (req, res) => {
  console.log("Settings test route hit");
  res.json({ message: "Settings routes are working" });
});

// File upload routes (put these first to avoid conflicts with general routes)
// Upload profile picture (single file)
router.post("/:userId/profile-picture", 
  upload.single('profilePicture'), 
  handleUploadError,
  uploadProfilePicture
);

// Upload documents (multiple files)
router.post("/:userId/documents", 
  upload.array('documents', 5), 
  handleUploadError,
  uploadDocuments
);

// Download document
router.get("/:userId/documents/:documentId/download", downloadDocument);

// Delete document
router.delete("/:userId/documents/:documentId", deleteDocument);

// Get user documents
router.get("/:userId/documents", getDocuments);

// Get specific field from settings
router.get("/:userId/field/:field", getSettingsField);

// Update specific field in settings
router.patch("/:userId/field/:field", updateSettingsField);

// General settings routes (put these last)
// Get all settings for a user
router.get("/:userId", getUserSettings);

// Update all settings for a user
router.put("/:userId", updateUserSettings);

// Reset settings to defaults
router.delete("/:userId", resetUserSettings);

export default router; 