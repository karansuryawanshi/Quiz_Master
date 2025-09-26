import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedOption: Number,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
