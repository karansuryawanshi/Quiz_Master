import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://quiz-master-j8er.onrender.com/api/auth/signup",
        form
      );
      // alert("Signup successful!");
      toast("Signup successful!");
      navigate("/login");
    } catch (err) {
      toast("Signup not successfull");
      // alert(err.response.data.msg);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Signup
        </button>
      </form>
      <p>
        If already register ?
        <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer"
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Signup;
