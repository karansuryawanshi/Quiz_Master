import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    timeLimit: { type: Number, default: 0 }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // will use later
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
