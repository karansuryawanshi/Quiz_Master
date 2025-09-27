import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Dashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    timeLimit: "",
  });
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem("token");

  // const dbUrl = import.meta.env.VITE_DATABASE_URL;

  const user = JSON.parse(localStorage.getItem("user")); // convert string → object
  const dbUrl = import.meta.env.VITE_DATABASE_URL;
  const HostUrl = import.meta.env.VITE_HOST_URL;
  // console.log("DB URL is :- ", dbUrl);
  // const userId = user._id;

  // Fetch quizzes on load
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${dbUrl}/api/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchQuizzes();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${dbUrl}/api/quiz`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast("Quiz Created!");
      setQuizzes([...quizzes, res.data]);
      setForm({ title: "", description: "", timeLimit: "" });
    } catch (err) {
      toast.error("Error creating quiz");
      // alert(err.response?.data?.msg || "");
    }
  };

  function logout() {
    localStorage.removeItem("token");
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mx-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard </h2>
        <button
          className="border-red-600 px-4 py-2 rounded-lg hover:bg-red-400 duration-300 bg-red-500 text-white"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>

      {/* Create Quiz Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow w-96 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Create Quiz</h3>
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          name="timeLimit"
          placeholder="Time limit (minutes)"
          value={form.timeLimit}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Create Quiz
        </button>
      </form>

      {/* Show Created Quizzes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Quizzes</h3>
        {quizzes.length === 0 ? (
          <p>No quizzes created yet</p>
        ) : (
          <ul className="space-y-2">
            {quizzes.map((quiz) => {
              // console.log("Quiz", quiz);
              return (
                <li key={quiz._id} className="bg-white p-3 rounded shadow">
                  <h4 className="font-bold">{quiz.title}</h4>
                  <p>{quiz.description}</p>
                  <small className="text-gray-500">
                    Time Limit: {quiz.timeLimit || "No limit"} mins
                  </small>
                  <div className="mt-2 flex flex-col">
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="text-blue-500 underline"
                    >
                      Manage Questions
                    </Link>
                    <Link
                      to={`/quiz/${quiz._id}/attempt`}
                      className="text-blue-500 underline"
                    >
                      Attempt Quiz
                    </Link>
                    <Link
                      className="text-blue-500 underline"
                      to={`${HostUrl}/results/history/${quiz._id}`}
                    >
                      History
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
