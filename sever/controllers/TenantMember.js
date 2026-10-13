import mongoose from "mongoose";
import TenantMemberModel from "../models/TenantMember.js";

// CREATE MEMBER
export const createTenantMember = async (req, res) => {
  try {
    const { tenantId, memberName, phone } = req.body;

    if (!tenantId || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        message: "Valid tenantId is required",
      });
    }

    if (!memberName?.trim()) {
      return res.status(400).json({
        message: "Member name is required",
      });
    }

    const member = await TenantMemberModel.create({
      tenantId,
      memberName: memberName.trim(),
      phone: phone?.trim() || "",
    });

    return res.status(201).json({
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    console.error("Create member error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE MEMBER
export const updateTenantMember = async (req, res) => {
  try {
    const { _id, memberName, phone, tenantId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Valid member ID is required" });
    }

    const member = await TenantMemberModel.findByIdAndUpdate(
      _id,
      { memberName, phone, tenantId },
      { new: true, runValidators: true },
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("Update member error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// DELETE MEMBER
export const DeleteTenantMember = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Valid member ID is required" });
    }

    const member = await TenantMemberModel.findByIdAndDelete(_id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({
      message: "Member deleted successfully",
      data: member,
    });
  } catch (error) {
    console.error("Delete member error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL MEMBERS FOR A TENANT
export const GetTenantMemberById = async (req, res) => {
  try {
    // Angular sends ?Id=TENANT_ID
    const tenantId = req.query.Id;

    if (!tenantId || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ message: "Valid tenant ID is required" });
    }

    const members = await TenantMemberModel.find({ tenantId });

    return res.status(200).json({
      message: "Tenant members fetched successfully",
      data: members,
    });
  } catch (error) {
    console.error("Get tenant members error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL MEMBERS
export const GetTenantsMember = async (req, res) => {
  try {
    const members = await TenantMemberModel.find();

    return res.status(200).json({
      message: "Members fetched successfully",
      data: members,
    });
  } catch (error) {
    console.error("Get all members error:", error);
    return res.status(500).json({ message: error.message });
  }
};