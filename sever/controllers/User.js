import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";
import crypto from "crypto";
import validator from "validator";

dotenv.config();

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character and be at least 8 characters long",
      });
    }

    const existingUser = await UserModel.findOne({
      email: trimmedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = await UserModel.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,

      isAccountVerified: false,

      verifyOtp: hashedOtp,

      verifyOtpExpiryAt: Date.now() + 5 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: trimmedEmail,
      subject: "Verify Your Account",

      html: `
      <div style="font-family:Arial,sans-serif">

      <h2>Email Verification</h2>

      <p>Hello ${trimmedName},</p>

      <p>Your OTP is:</p>

      <h1 style="letter-spacing:5px">
      ${otp}
      </h1>

      <p>This OTP will expire in 5 minutes.</p>

      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const token = jwt.sign(
      {
        userId: newUser._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

      maxAge: 60 * 60 * 1000,

      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const VerifyAccount = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const userId = req.user.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    if (!user.verifyOtp || !user.verifyOtpExpiryAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (Date.now() > user.verifyOtpExpiryAt) {
      user.verifyOtp = null;
      user.verifyOtpExpiryAt = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), user.verifyOtp);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isAccountVerified = true;

    user.verifyOtp = null;

    user.verifyOtpExpiryAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.log("Verify Account Error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = await UserModel.findOne({
      email: trimmedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is verified
    if (!user.isAccountVerified) {
      // Optional: Delete user if OTP expired
      if (user.verifyOtpExpiryAt && Date.now() > user.verifyOtpExpiryAt) {
        await UserModel.findByIdAndDelete(user._id);

        return res.status(400).json({
          success: false,
          message: "Account verification expired. Please register again.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

      path: "/",

      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token, // optional for mobile/Postman

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,

      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({})
      .select("-password -verifyOtp")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.log("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const DeleteUnverifiedUsers = async (req, res) => {
  setInterval(async () => {
    try {
      const result = await UserModel.deleteMany({
        isAccountVerified: false,
        verifyOtpExpiryAt: {
          $lt: Date.now(),
        },
      });

      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} unverified user(s).`);
      }
    } catch (error) {
      console.error("Delete Unverified Users Error:", error);
    }
  }, 60 * 1000); // Check every 1 minute
};
