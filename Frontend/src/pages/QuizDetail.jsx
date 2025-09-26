import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

function QuizDetail() {
  const { id } = useParams(); // quizId from route
  const token = localStorage.getItem("token");

  const [jsonInput, setJsonInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    questionText: "",
    options: [],
    correctAnswer: 0,
  });
  const [form, setForm] = useState({
    questionText: "",
    options: ["", ""],
    correctAnswer: 0,
  });

  // Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get(`http://localhost:4000/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    };
    fetchQuestions();
  }, [id, token]);

  const handleJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        toast.error("JSON must be an array of questions");
        return;
      }

      const res = await axios.post(
        `http://localhost:4000/api/questions/bulk/${id}`,
        { questions: parsed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuestions([...questions, ...res.data]); // append new questions
      setJsonInput(""); // clear textarea
      toast.success("Questions added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Invalid JSON or server error");
    }
  };

  // Handle option change
  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  // Add another option field
  const addOption = () => setForm({ ...form, options: [...form.options, ""] });

  // Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:4000/api/questions/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions([...questions, res.data]);
      setForm({ questionText: "", options: ["", ""], correctAnswer: 0 });
      toast("Question added!");
    } catch (err) {
      toast.error("Error adding question");
      // alert(err.response?.data?.msg || "Error adding question");
    }
  };

  const handleDelete = async (qid) => {
    try {
      await axios.delete(`http://localhost:4000/api/questions/${qid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q._id !== qid));
      toast.success("Question deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting question");
    }
  };

  const handleEditStart = (q) => {
    setEditId(q._id);
    setEditForm({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
    });
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/questions/${editId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(questions.map((q) => (q._id === editId ? res.data : q)));
      setEditId(null);
      toast.success("Question updated!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating question");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Quiz Details </h2>
      <div className="flex items-center justify-center gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow w-96 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Add Question</h3>
          <input
            type="text"
            placeholder="Question Text"
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
            className="border p-2 w-full mb-2"
            required
          />
          {form.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-gray-200 px-2 py-1 rounded mb-2"
          >
            + Add Option
          </button>
          <select
            value={form.correctAnswer}
            onChange={(e) =>
              setForm({ ...form, correctAnswer: parseInt(e.target.value) })
            }
            className="border p-2 w-full mb-4"
          >
            {form.options.map((_, idx) => (
              <option key={idx} value={idx}>
                Correct Answer: Option {idx + 1}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Add Question
          </button>
        </form>
        <div className="flex flex-col justify-between gap-2">
          <h3 className="text-lg font-semibold mb-2">Add Questions (JSON)</h3>

          <textarea
            name=""
            id=""
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="border w-96 p-2"
            rows={12}
            placeholder={`Example:
              [
                {
                  "questionText": "What is 2+2?",
                  "options": ["3", "4", "5"],
                  "correctAnswer": 1
                }
              ]`}
          ></textarea>
          <button
            onClick={handleJsonSubmit}
            className=" bg-blue-500 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      {/* List of Questions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Questions</h3>
        {questions.length === 0 ? (
          <p>No questions yet</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={q._id} className="bg-white p-3 rounded shadow">
                {editId === q._id ? (
                  <div>
                    <input
                      type="text"
                      className="border p-2 w-full mb-2"
                      value={editForm.questionText}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          questionText: e.target.value,
                        })
                      }
                    />
                    {editForm.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        className="border p-2  w-full mb-2"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editForm.options];
                          newOpts[idx] = e.target.value;
                          setEditForm({ ...editForm, options: newOpts });
                        }}
                      />
                    ))}
                    <select
                      className="border p-2 w-full mb-2"
                      value={editForm.correctAnswer}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          correctAnswer: parseInt(e.target.value),
                        })
                      }
                    >
                      {editForm.options.map((_, idx) => (
                        <option key={idx} value={idx}>
                          Correct Answer: Option {idx + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleEditSave}
                      className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <strong>Q{i + 1}:</strong> {q.questionText}
                    <ul className="list-disc pl-6">
                      {q.options.map((opt, idx) => (
                        <li
                          key={idx}
                          className={
                            idx === q.correctAnswer
                              ? "font-bold text-green-600"
                              : ""
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEditStart(q)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default QuizDetail;
