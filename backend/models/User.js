import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: { type: String, required: true },
    password: { type: String, required: true },
    classLevel: { type: Number, required: true, enum: [6, 7, 8, 9, 10] },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
