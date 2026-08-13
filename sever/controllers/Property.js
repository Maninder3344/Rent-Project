import PropertyModel from "../models/Property.js";

export const CreateProperty = async (req, res) => {
  try {
    let proData = await PropertyModel.create({
      name: req.body.name,
      address: req.body.address,
      UnitPrice: req.body.UnitPrice,
    });
    if (proData) {
      res
        .status(200)
        .json({ message: "Property created successfully", data: proData });
    } else {
      res.status(400).json({ message: "Property creation failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateProperty = async (req, res) => {
  try {
    let proData = await PropertyModel.findByIdAndUpdate(
      { _id: req.body._id },
      {
        name: req.body.name,
        address: req.body.address,
        UnitPrice: req.body.UnitPrice,
      },
       {
        new: true,            // Return the updated document
        runValidators: true,  // Run min/max validation
      }
    );
    if (proData) {
      res
        .status(200)
        .json({ message: "Property updated successfully", data: proData });
    } else {
      res.status(400).json({ message: "Property update failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteProperty = async (req, res) => {
  try {
    let proData = await PropertyModel.findByIdAndDelete({ _id: req.body._id });
    if (proData) {
      res
        .status(200)
        .json({ message: "Property deleted successfully", data: proData });
    } else {
      res.status(400).json({ message: "Property deletion failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetAllProperties = async (req, res) => {
  try {
    let proData = await PropertyModel.find();
    if (proData) {
      res
        .status(200)
        .json({ message: "Properties retrieved successfully", data: proData });
    } else {
      res.status(400).json({ message: "Failed to retrieve properties" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetPropertyById = async (req, res) => {
  try {
    let proData = await PropertyModel.findById({ _id: req.body._id });
    if (proData) {
      res
        .status(200)
        .json({ message: "Property retrieved successfully", data: proData });
    } else {
      res.status(400).json({ message: "Failed to retrieve property" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
