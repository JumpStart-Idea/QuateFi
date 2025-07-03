import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  createProduct,
  updateProduct,
  deleteProduct,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/client.js";

const router = express.Router();

router.use(verifyToken);

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

// Product CRUD
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Customer CRUD
router.post("/customers", createCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

// Admin CRUD
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);

export default router;
