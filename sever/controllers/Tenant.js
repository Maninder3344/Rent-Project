import TenantModel from "../models/Tenant.js";

export const CreateTenant = async (req, res) => {
  try {
    let tenantData = await TenantModel.create({
      userId: req.body.userId,
      roomId: req.body.roomId,
      name: req.body.name,
      phone: req.body.phone,
      isVerified: req.body.isVerified,
      adhaarCardNumber: req.body.adhaarCardNumber,
      members: req.body.members,
      vehicleNumber: req.body.vehicleNumber,
    });
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant created successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Tenant creation failed" });
    }
    console.log(tenantData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateTenant = async (req, res) => {
  try {
    let tenantData = await TenantModel.findByIdAndUpdate(
      { _id: req.body._id },
      {
        userId: req.body.userId,
        name: req.body.name,
        phone: req.body.phone,
        isVerified: req.body.isVerified,
        adhaarCardNumber: req.body.adhaarCardNumber,
        members: req.body.members,
        vehicleNumber: req.body.vehicleNumber,
      },
    );
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant updated successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Tenant update failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteTenant = async (req, res) => {
  try {
    let tenantData = await TenantModel.findByIdAndDelete({ _id: req.body._id });
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant deleted successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Tenant deletion failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetTenants = async (req, res) => {
  try {
    let tenantData = await TenantModel.find();
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenants retrieved successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Failed to retrieve tenants" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const GetTenantById = async (req, res) => {
  try {
    let tenantData = await TenantModel.findById({
      _id: req.body._id,
    }).$populate("userId");
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant retrieved successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Failed to retrieve tenant" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
