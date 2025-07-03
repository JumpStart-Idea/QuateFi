import express from "express";
import verifyToken from "../middleware/auth.js";
import { getAdmins, getUserPerformance } from "../controllers/management.js";

const router = express.Router();

router.use(verifyToken);

router.get("/admins", getAdmins);
router.get("/performance/:id", getUserPerformance);

export default router;
