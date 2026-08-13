import RoomModel from "../models/Room.js";

export const CreateRoom = async (req, res) => {
  try {
    let roomData = await RoomModel.create({
      roomNo: req.body.roomNo,
      floor: req.body.floor,
      rent: req.body.rent,
      // meterId: req.body.meterId,
      propertyId: req.body.propertyId,
    });
    if (roomData) {
      res
        .status(200)
        .json({ message: "Room created successfully", data: roomData });
    } else {
      res.status(400).json({ message: "Room creation failed" });
    }
    
  } catch (error) {
    if (error.code === 11000) {
    return res.status(409).json({
      message: "Room number already exists for this property.",
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
  });
  }
};

export const UpdateRoom = async (req, res) => {
  try {
    let roomData = await RoomModel.findByIdAndUpdate(
      { _id: req.body._id },
      {
        roomNo: req.body.roomNo,
        floor: req.body.floor,
        rent: req.body.rent,
        // meterId: req.body.meterId,
        propertyId: req.body.propertyId,
      },
    );
    if (roomData) {
      res
        .status(200)
        .json({ message: "Room updated successfully", data: roomData });
    } else {
      res.status(400).json({ message: "Room update failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteRoom = async (req, res) => {
  try {
    let roomData = await RoomModel.findByIdAndDelete({ _id: req.body._id });
    if (roomData) {
      res
        .status(200)
        .json({ message: "Room deleted successfully", data: roomData });
    } else {
      res.status(400).json({ message: "Room deletion failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetAllRooms = async (req, res) => {
  try {
    let roomData = await RoomModel.find().populate("propertyId");
    if (roomData) {
      res
        .status(200)
        .json({ message: "Rooms fetched successfully", data: roomData });
    } else {
      res.status(400).json({ message: "Rooms fetch failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const GetRoomById = async (req, res) => {
//   try {
//     let roomData = await RoomModel.findById({ _id: req.body._id }).populate(
//       "propertyId",
//     );
//     if (roomData) {
//       res
//         .status(200)
//         .json({ message: "Room fetched successfully", data: roomData });
//     } else {
//       res.status(400).json({ message: "Room fetch failed" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


export const GetRoomById = async (req, res) => {
  try {
    const roomData = await RoomModel.find({
      propertyId: req.query._id,   // Match the selected property
    }).populate("propertyId");     // Include property details

    res.status(200).json({
      message: "Rooms fetched successfully",
      data: roomData,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};