import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://quiz-master-j8er.onrender.com/api/auth/login",
        form
      );

      // Save token
      localStorage.setItem("token", res.data.token);

      // Fetch user details using token
      const userRes = await axios.get(
        "https://quiz-master-j8er.onrender.com/api/auth/me",
        {
          headers: { Authorization: `Bearer ${res.data.token}` },
        }
      );

      // Save user details in localStorage
      localStorage.setItem("user", JSON.stringify(userRes.data));

      toast("Login successful.");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
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
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
      <p>
        If not register ?
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 cursor-pointer"
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
