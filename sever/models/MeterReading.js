import mongoose from "mongoose";

const meterReadingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    initialReading: {
      type: Number,
      default: 0,
    },

    currentReading: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const MeterReadingModel = mongoose.model("MeterReading", meterReadingSchema);

export default MeterReadingModel;
