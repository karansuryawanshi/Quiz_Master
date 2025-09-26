import express from "express";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Add question to a quiz
router.post("/:quizId", auth, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({ msg: "At least 2 options are required" });
    }
    // console.log(quizId, questionText, options, correctAnswer);
    const question = new Question({
      quizId,
      questionText,
      options,
      correctAnswer,
    });
    await question.save();
    // Push question into quiz
    await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: question._id } },
      { new: true }
    );

    res.json(question);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all questions for a quiz
router.get("/:quizId", auth, async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update question
router.put("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const updated = await Question.findByIdAndUpdate(questionId, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating question" });
  }
});

// Delete question
router.delete("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    await Question.findByIdAndDelete(questionId);
    res.json({ msg: "Question deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting question" });
  }
});

router.post("/bulk/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ msg: "Questions must be an array" });
    }

    // Insert questions
    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        ...q,
        quizId,
      }))
    );

    // Update Quiz with new question IDs
    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: { $each: createdQuestions.map((q) => q._id) } },
    });

    res.json(createdQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
