import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
      trim: true,
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

// Same room number allowed on different floors
// Same room number not allowed on the same floor
roomSchema.index(
  {
    propertyId: 1,
    floor: 1,
    roomNo: 1
  },  
    {
      unique: true
    }
);

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;