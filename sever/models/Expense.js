import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },

    expense: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;
