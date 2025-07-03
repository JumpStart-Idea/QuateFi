import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
import bcrypt from "bcrypt";
import AffiliateStat from "../models/AffiliateStat.js";
import jwt from "jsonwebtoken";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Product CRUD
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Create dummy ProductStat
    const now = new Date();
    const year = now.getFullYear();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthlyData = months.map(month => ({
      month,
      totalSales: Math.floor(Math.random() * 10000),
      totalUnits: Math.floor(Math.random() * 1000)
    }));
    const dailyData = Array.from({length: 7}).map((_, i) => ({
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).toISOString().slice(0,10),
      totalSales: Math.floor(Math.random() * 500),
      totalUnits: Math.floor(Math.random() * 50)
    }));
    const productStat = new ProductStat({
      productId: product._id,
      yearlySalesTotal: Math.floor(Math.random() * 100000),
      yearlyTotalSoldUnits: Math.floor(Math.random() * 10000),
      year,
      monthlyData,
      dailyData
    });
    await productStat.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Customer CRUD
export const createCustomer = async (req, res) => {
  try {
    const { email, phoneNumber, password, ...rest } = req.body;
    const existingUser = await User.findOne({ $or: [ { email }, { phoneNumber } ] });
    if (existingUser) {
      if (existingUser.email === email && existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({ message: "Email and phone number already exist" });
      } else if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, email, phoneNumber, password: hashedPassword, role: "user" });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, phoneNumber, password, ...rest } = req.body;
    const existingUser = await User.findOne({ $or: [ { email }, { phoneNumber } ] });
    if (existingUser) {
      if (existingUser.email === email && existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({ message: "Email and phone number already exist" });
      } else if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, email, phoneNumber, password: hashedPassword, role: "admin" });
    await user.save();

    // Create dummy AffiliateStat
    const affiliateStat = new AffiliateStat({
      userId: user._id,
      affiliateSales: []
    });
    await affiliateStat.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findOneAndUpdate({ _id: id, role: "admin" }, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin not found" });
    await AffiliateStat.deleteOne({ userId: id });
    res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, phoneNumber, password, ...rest } = req.body;
    const existingUser = await User.findOne({ $or: [ { email }, { phoneNumber } ] });
    if (existingUser) {
      if (existingUser.email === email && existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({ message: "Email and phone number already exist" });
      } else if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, email, phoneNumber, password: hashedPassword, role: "user" });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret");
    res.status(201).json({ message: "Registration successful", user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret");
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
