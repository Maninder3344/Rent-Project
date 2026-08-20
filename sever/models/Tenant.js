import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    adhaarCardNumber: {
      type: String,
      required: true,
      unique: true,
    },

    members: {
      type: Number,
      default: 1,
    },

    vehicleNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const TenantModel = mongoose.model("Tenant", tenantSchema);

export default TenantModel;
