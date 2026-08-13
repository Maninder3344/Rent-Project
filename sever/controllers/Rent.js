import RentModel from "../models/Rent.js";

// Create Rent
export const CreateRent = async (req, res) => {
  try {
    const {
      tenantId,
      roomId,
      rentAmount,
      electricityBill,
      totalPaid,
      paymentDate,
    } = req.body;

    const balance =
      Number(rentAmount) +
      Number(electricityBill || 0) -
      Number(totalPaid || 0);

    let status = "Pending";

    if (balance <= 0) {
      status = "Paid";
    } else if (totalPaid > 0) {
      status = "Partial";
    }

    const rent = await RentModel.create({
      tenantId,
      roomId,
      rentAmount,
      electricityBill: electricityBill || 0,
      totalPaid: totalPaid || 0,
      balance,
      paymentDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Rent created successfully",
      data: rent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Rent
export const GetAllRent = async (req, res) => {
  try {
    const rents = await RentModel.find()
      .populate("tenantId")
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: rents.length,
      data: rents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Rent By ID
export const GetRentById = async (req, res) => {
  try {
    const rent = await RentModel.findById(req.params.id)
      .populate("tenantId")
      .populate("roomId");

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Rent
export const UpdateRent = async (req, res) => {
  try {
    const rent = await RentModel.findById(req.params.id);

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent not found",
      });
    }

    rent.tenantId = req.body.tenantId || rent.tenantId;

    rent.roomId = req.body.roomId || rent.roomId;

    rent.rentAmount = req.body.rentAmount ?? rent.rentAmount;

    rent.electricityBill = req.body.electricityBill ?? rent.electricityBill;

    rent.totalPaid = req.body.totalPaid ?? rent.totalPaid;

    rent.paymentDate = req.body.paymentDate || rent.paymentDate;

    rent.balance =
      Number(rent.rentAmount) +
      Number(rent.electricityBill) -
      Number(rent.totalPaid);

    if (rent.balance <= 0) {
      rent.status = "Paid";
    } else if (rent.totalPaid > 0) {
      rent.status = "Partial";
    } else {
      rent.status = "Pending";
    }

    await rent.save();

    res.status(200).json({
      success: true,
      message: "Rent updated successfully",
      data: rent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Rent
export const DeleteRent = async (req, res) => {
  try {
    const rent = await RentModel.findById(req.params.id);

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent not found",
      });
    }

    await rent.deleteOne();

    res.status(200).json({
      success: true,
      message: "Rent deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
