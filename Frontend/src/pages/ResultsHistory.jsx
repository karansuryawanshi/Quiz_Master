import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResultsHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  const dbUrl = import.meta.env.VITE_DATABASE_URL;

  //   console.log("Params is :- ", params.id);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // const userId = localStorage.getItem("userId");
        const user = JSON.parse(localStorage.getItem("user")); // convert string → object
        const userId = user._id;
        const res = await axios.get(`${dbUrl}/api/quiz/results/${userId}`);
        setResults(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResults();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading your results...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Quiz History</h2>
      {results.length === 0 ? (
        <p className="text-gray-600">No quiz attempts yet.</p>
      ) : (
        <div className="space-y-4">
          {results.map((r, idx) => {
            return (
              <>
                {params.id == r.quizId._id && (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <>
                      <p className="font-medium text-lg">
                        {r.quizId?.title || "Unknown Quiz"}
                      </p>
                      <p>
                        Score:{" "}
                        <span className="font-semibold text-blue-600">
                          {r.score}/{r.total}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Attempted on {new Date(r.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => navigate(`/results/${r._id}`)}
                        className="mt-3 px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        View Details
                      </button>
                    </>
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsHistory;
