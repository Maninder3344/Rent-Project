import MeterReadingModel from "../models/MeterReading";

export const CreateMeterReading = async (req, res) => {
  try {
    const { roomId, initialReading, currentReading } = req.body;
    const meterReading = await MeterReadingModel.create({
      roomId,
      initialReading,
      currentReading,
    });
    res.status(201).json({
      message: "Meter reading created successfully",
      data: meterReading,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetAllMeterReadings = async (req, res) => {
  try {
    const meterReadings = await MeterReadingModel.find();
    res.status(200).json({
      message: "Meter readings retrieved successfully",
      data: meterReadings,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetMeterReadingById = async (req, res) => {
  try {
    const meterReading = await MeterReadingModel.findById(req.params.id);
    if (!meterReading) {
      return res.status(404).json({ message: "Meter reading not found" });
    }
    res.status(200).json({
      message: "Meter reading retrieved successfully",
      data: meterReading,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateMeterReading = async (req, res) => {
  try {
    const { roomId, initialReading, currentReading } = req.body;
    const meterReading = await MeterReadingModel.find;
    ByIdAndUpdate(
      req.params.id,
      { roomId, initialReading, currentReading },
      { new: true },
    );
    if (!meterReading) {
      return res.status(404).json({ message: "Meter reading not found" });
    }
    res.status(200).json({
      message: "Meter reading updated successfully",
      data: meterReading,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteMeterReading = async (req, res) => {
  try {
    const meterReading = await MeterReadingModel.findByIdAndDelete(
      req.params.id,
    );
    if (!meterReading) {
      return res.status(404).json({ message: "Meter reading not found" });
    }
    res.status(200).json({ message: "Meter reading deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
