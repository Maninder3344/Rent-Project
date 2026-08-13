import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    rentAmount: {
      type: Number,
      required: true,
    },

    electricityBill: {
      type: Number,
      default: 0,
    },

    totalPaid: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Paid", "Partial", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const RentModel = mongoose.model("Rent", rentSchema);

export default RentModel;
