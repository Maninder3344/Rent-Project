import ExpenseModel from "../models/Expense.js";

// Create Expense
export const CreateExpense = async (req, res) => {
  try {
    const { date, expense, amount } = req.body;

    const newExpense = await ExpenseModel.create({
      date,
      expense,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Expenses
export const GetAllExpense = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Expense By Id
export const GetExpenseById = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Expense
export const UpdateExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    expense.date = req.body.date || expense.date;

    expense.expense = req.body.expense || expense.expense;

    expense.amount = req.body.amount ?? expense.amount;

    await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Expense
export const DeleteExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

