import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
//dotenv import format
// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};

// MongoDB Connection
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectToDatabase();

// Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  id: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Job = mongoose.model("Job", jobSchema);

// Routes

// Signin (POST)
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ email: user.email, password: user.password, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signup (POST)
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ email: newUser.email, password: newUser.password });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Jobs (POST)
app.post("/jobs", authMiddleware, async (req, res) => {
  const { title, description, location, salary, id } = req.body;

  try {
    const newJob = new Job({
      title,
      description,
      id,
      location,
      salary,
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Jobs (GET)
app.get("/jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Jobs (DELETE)
app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const job = await Job.findOne({ id });
    console.log(job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Job.deleteOne({ _id: job._id });
    res.status(200).json({ message: "Job deleted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Test API (GET)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
