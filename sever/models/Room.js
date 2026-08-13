import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
     
    },

    floor: {
      type: Number,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    // meterId: {
    //   type: String,
    // },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Room number must be unique within the same property
roomSchema.index({ propertyId: 1, roomNo: 1 }, { unique: true });

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;