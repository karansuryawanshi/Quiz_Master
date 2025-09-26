import express from "express";
import Quiz from "../models/Quiz.js";
import { auth } from "../middleware/auth.js";
import Result from "../models/Result.js";

const router = express.Router();

// Create quiz
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, timeLimit } = req.body;
    const quiz = new Quiz({
      title,
      description,
      timeLimit,
      createdBy: req.user,
    });
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all quizzes of logged in user
router.get("/", auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:quizId/questions", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate(
      "questions",
      "_id questionText options correctAnswer"
    );
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    const questions = quiz.questions.map((q) => ({
      _id: q._id,
      text: q.questionText,
      options: q.options,
    }));

    // console.log("questions", questions);

    res.json({
      quizId: quiz._id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      questions,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Submit answers and calculate score
router.post("/:quizId/submit", async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId).populate(
      "questions",
      "_id questionText options correctAnswer"
    );
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    let score = 0;
    const results = [];
    quiz.questions.forEach((q) => {
      const userAnswer = answers.find((a) => a.questionId == q._id.toString());

      // console.log("userAnswer?.selectedOption", userAnswer?.selectedOption);
      // console.log("q.correctOption", q.correctAnswer);

      const isCorrect =
        Number(userAnswer?.selectedOption) === Number(q?.correctAnswer);
      // console.log("Is correct :- ", isCorrect);

      if (isCorrect) score++;

      results.push({
        questionId: q._id,
        selectedOption: userAnswer?.selectedOption,
        isCorrect,
      });
    });

    const newResult = new Result({
      userId,
      quizId: quiz._id,
      score,
      total: quiz.questions.length,
      answers: results,
    });

    await newResult.save();

    res.json({
      msg: "Quiz submitted successfully",
      score,
      total: quiz.questions.length,
      answers: results,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/results/:userId", async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get detailed result by resultId
router.get("/result/:resultId", async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate("quizId", "title timeLimit") // fetch quiz details
      .populate("answers.questionId", "questionText options correctAnswer");

    if (!result) return res.status(404).json({ msg: "Result not found" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
