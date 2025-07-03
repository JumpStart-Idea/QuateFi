import express from "express";
import verifyToken from "../middleware/auth.js";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.use(verifyToken);

router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

export default router;
