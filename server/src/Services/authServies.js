import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Schema/userSchema.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists (case-insensitive email)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving (ensure consistent salt rounds)
    const saltRounds = 10; // Explicitly set salt rounds for consistency
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Debug: Log the hashed password for verification
    console.log("Hashed password for registration:", hashedPassword);

    // Create and save new user
    const newUser = new User({
      name,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password: hashedPassword,
    });

    await newUser.save();

    // Return response without sensitive data (e.g., password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const generateToken = (user) => {
  // Check if ACCESS_TOKEN_SECRET is defined, throw error if not
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in .env file");
  }

  const accessToken = jwt.sign(
    { id: user._id }, // Use only id for simplicity (remove role if not used)
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  return { accessToken };
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Debug: Log user and password for troubleshooting
    console.log("User found:", user);
    console.log("Comparing password:", password, "with hashed:", user.password);

    // Compare passwords with additional debugging
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Additional debug: Log the comparison result and input/hashed passwords
      console.log("Password comparison failed. Input password:", password, "Hashed password:", user.password);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate and return token
    try {
      const { accessToken } = generateToken(user);
      res.status(200).json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res.status(500).json({ message: "Failed to generate token" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};