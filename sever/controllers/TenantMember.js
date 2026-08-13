import TenantModel from "../models/Tenant.js";

export const createTenant = async (req, res) => {
  try {
    let tenantData = await TenantModel.create({
      userId: req.body.userId,
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
    res.status(500).json({ message: error.message });
  }
};

export const updateTenant = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    let tenantData = await TenantModel.findByIdAndDelete({
      _id: req.body._id,
    });
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant deleted successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Tenant deletion failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetTenants = async (req, res) => {
  try {
    let tenamtData = await TenantModel.find();
    if (tenamtData) {
      res
        .status(200)
        .json({ message: "Tenants fetched successfully", data: tenamtData });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetTenantById = async (req, res) => {
  try {
    let tenantData = await TenantModel.findById({ _id: req.params.id });
    if (tenantData) {
      res
        .status(200)
        .json({ message: "Tenant fetched successfully", data: tenantData });
    } else {
      res.status(400).json({ message: "Tenant fetch failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
