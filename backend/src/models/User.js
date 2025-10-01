import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    location: { type: String, default: "" },
    profileUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
