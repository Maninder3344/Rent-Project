import TenantRoomModel from "../models/TenantRoom.js";

export const CreateTenantRoom = async (req, res) => {
  try {
    let tenantRoomData = await TenantRoomModel.create({
      tenantId: req.body.tenantId,
      roomId: req.body.roomId,
      propertyId: req.body.propertyId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    if (tenantRoomData) {
      res
        .status(200)
        .json({
          message: "TenantRoom created successfully",
          data: tenantRoomData,
        });
    } else {
      res.status(400).json({ message: "TenantRoom creation failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetAllTenantRooms = async (req, res) => {
  try {
    let tenantRoomData = await TenantRoomModel.find();
    if (tenantRoomData) {
      res
        .status(200)
        .json({
          message: "TenantRooms retrieved successfully",
          data: tenantRoomData,
        });
    } else {
      res.status(400).json({ message: "TenantRooms retrieval failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetTenantRoomById = async (req, res) => {
  try {
    let tenantRoomData = await TenantRoomModel.findById({
      _id: req.body._id,
    });
    if (tenantRoomData) {
      res
        .status(200)
        .json({
          message: "TenantRoom retrieved successfully",
          data: tenantRoomData,
        });
    } else {
      res.status(400).json({ message: "TenantRoom retrieval failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateTenantRoom = async (req, res) => {
  try {
    let tenantRoomData = await TenantRoomModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        tenantId: req.body.tenantId,
        roomId: req.body.roomId,
        propertyId: req.body.propertyId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
    );
    if (tenantRoomData) {
      res
        .status(200)
        .json({
          message: "TenantRoom updated successfully",
          data: tenantRoomData,
        });
    } else {
      res.status(400).json({ message: "TenantRoom update failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteTenantRoom = async (req, res) => {
  try {
    let tenantRoomData = await TenantRoomModel.findByIdAndDelete({
      _id: req.body._id,
    });
    if (tenantRoomData) {
      res
        .status(200)
        .json({
          message: "TenantRoom deleted successfully",
          data: tenantRoomData,
        });
    } else {
      res.status(400).json({ message: "TenantRoom deletion failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
