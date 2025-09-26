import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({}); // ✅ store review flags
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/quiz/${quizId}/questions`
        );
        setQuiz(res.data);
        setTimeLeft(res.data.timeLimit * 60); // convert minutes -> seconds
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // auto-submit when time finishes
      return;
    }
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const toggleReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      const res = await axios.post(
        `http://localhost:4000/api/quiz/${quizId}/submit`,
        {
          userId,
          answers: Object.keys(answers).map((qid) => ({
            questionId: qid,
            selectedOption: answers[qid],
          })),
        }
      );
      toast("Test submitted Successfully");

      navigate(`/quiz/${quizId}/result`, { state: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="flex max-w-6xl mx-auto p-6">
      {/* ✅ Left side panel with question index */}
      <div className="w-1/4 border-r pr-4">
        <h3 className="font-semibold mb-3">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {quiz.questions.map((q, idx) => {
            const isCurrent = currentIndex === idx;
            const isAnswered = answers[q._id] !== undefined;
            const isMarked = markedForReview[q._id];

            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 flex items-center justify-center rounded border
                  ${isCurrent ? "bg-blue-500 text-white" : ""}
                  ${isAnswered ? "border-green-500" : ""}
                  ${isMarked ? "bg-purple-400 text-white" : "bg-gray-200"}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* ✅ Legend */}
        <div className="mt-4 text-sm space-y-1">
          <p>
            <span className="inline-block w-4 h-4 bg-gray-200 border mr-2"></span>
            Not Visited
          </p>
          <p>
            <span className="inline-block w-4 h-4 border border-green-500 mr-2"></span>
            Answered
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-purple-400 mr-2"></span>
            Marked for Review
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
            Current
          </p>
        </div>
      </div>

      {/* ✅ Main question area */}
      <div className="w-3/4 pl-6">
        {currentQuestion ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <p className="text-red-500 font-semibold">
                Time Left: {formatTime(timeLeft)}
              </p>
            </div>

            <div className="mb-6 p-4 border rounded-lg shadow-sm">
              <p className="font-medium mb-2">
                {currentIndex + 1}. {currentQuestion.text}
              </p>
              <div className="space-y-2">
                {currentQuestion.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={currentQuestion._id}
                      value={i}
                      checked={answers[currentQuestion._id] === i}
                      onChange={() =>
                        handleOptionChange(currentQuestion._id, i)
                      }
                      className="h-4 w-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ✅ Navigation buttons + Review button */}
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                {currentIndex > 0 && (
                  <button
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Previous
                  </button>
                )}
                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>

              {/* ✅ Mark for Review toggle */}
              <button
                onClick={() => toggleReview(currentQuestion._id)}
                className={`px-4 py-2 rounded ${
                  markedForReview[currentQuestion._id]
                    ? "bg-purple-500 text-white"
                    : "bg-yellow-400"
                }`}
              >
                {markedForReview[currentQuestion._id]
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl">No question created</p>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
