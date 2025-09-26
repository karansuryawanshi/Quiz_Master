import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p className="text-center mt-10">No result found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Result</h2>
      <p className="text-lg mb-2">
        Score: <span className="font-semibold">{state.score}</span> /{" "}
        {state.total}
      </p>
      <div className="text-left mt-4">
        {state.answers.map((ans, idx) => (
          <div key={idx} className="p-3 border rounded-lg mb-2">
            <p>
              <span className="font-medium">Q{idx + 1}:</span>{" "}
              {ans.isCorrect ? (
                <span className="text-green-600">Correct ✅</span>
              ) : (
                <span className="text-red-600">Wrong ❌</span>
              )}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default QuizResult;
