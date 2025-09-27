import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultDetail = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const dbUrl = import.meta.env.VITE_DATABASE_URL;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${dbUrl}/api/quiz/result/${resultId}`);
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading)
    return <p className="text-center mt-10">Loading result details...</p>;
  if (!result) return <p className="text-center mt-10">No details found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{result.quizId?.title}</h2>
      <p className="mb-4">
        Final Score:{" "}
        <span className="font-semibold text-blue-600">
          {result.score}/{result.total}
        </span>
      </p>
      <div className="space-y-4">
        {result.answers.map((ans, idx) => {
          //   console.log("ans is :---- ", ans?.questionId?.correctAnswer);
          return (
            <div
              key={idx}
              className={`p-4 border rounded-lg ${
                ans.isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-medium mb-2">
                {idx + 1}. {ans?.questionId?.questionText}
              </p>
              <ul className="ml-4 space-y-1">
                {ans.questionId?.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`${
                      i === ans.questionId?.correctOption
                        ? "text-green-700 font-semibold"
                        : i + 1 === ans.selectedOption
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {i + 1}. {opt}
                  </li>
                ))}
                {!ans.isCorrect && (
                  <p className="mt-2 text-green-800">
                    Correct Answer:{" "}
                    {ans.questionId?.options[ans.questionId?.correctAnswer - 1]}
                  </p>
                )}
              </ul>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/results/history")}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to History
      </button>
    </div>
  );
};

export default ResultDetail;
