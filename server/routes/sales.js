import express from "express";
import verifyToken from "../middleware/auth.js";
import { getSales } from "../controllers/sales.js";

const router = express.Router();

router.use(verifyToken);

router.get("/sales", getSales);

export default router;
