import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false },
);

const graphSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    points: {
      type: [pointSchema],
      default: [],
    },

    precisionStep: {
      type: Number,
      default: 1,
      min: 0,
    },

    xLabel: {
      type: String,
      default: "X",
    },

    yLabel: {
      type: String,
      default: "Y",
    },

    xScale: {
      type: Number,
      default: 1,
      min: 0.000000001,
    },

    yScale: {
      type: Number,
      default: 1,
      min: 0.000000001,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Graph", graphSchema);
