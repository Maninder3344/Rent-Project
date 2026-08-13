import mongoose from "mongoose";

const tenantMemberSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    memberName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const TenantMemberModel = mongoose.model("TenantMember", tenantMemberSchema);

export default TenantMemberModel;
