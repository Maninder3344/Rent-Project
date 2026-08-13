import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    UnitPrice: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
  },
  { timestamps: true },
);

const PropertyModel = mongoose.model("Property", propertySchema);
export default PropertyModel;
