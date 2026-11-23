import mongoose from "mongoose";

const experimentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  classLevel: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  summary: String,
  aim: String,
  theory: String,
  steps: [String],
  observations: [String],
  result: String,
  precautions: [String],
  items: [
    {
      id: String,
      name: String,
      reuse: {
        type: Boolean,
        default: false,
      },
    },
  ],
  sim: [
    {
      text: String,
      item: String,
      sound: String,
      result: String,
    },
  ],
});

const Experiment = mongoose.model("Experiment", experimentSchema);

export default Experiment;
