import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    password: {
      type: String,

      required: true,
    },

    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user",
    },

    isAccountVerified: {
      type: Boolean,

      default: false,
    },

    verifyOtp: {
      type: String,

      default: "",
    },

    verifyOtpExpiryAt: {
      type: Number,

      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model(
  "User",
  userSchema
);

export default UserModel;