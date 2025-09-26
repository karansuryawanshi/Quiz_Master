import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import QuizDetail from "./pages/QuizDetail";
import QuizAttempt from "./pages/QuizAttempt";
import QuizResult from "./pages/QuizResult";
import ResultsHistory from "./pages/ResultsHistory";
import ResultDetail from "./pages/ResultDetail";
import Home from "./pages/Home";
import { Link } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");
  // console.log(token);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              Login is requires{" "}
              <Link
                className="text-blue-500 underline flex justify-center my-8"
                to={`/login`}
              >
                Login
              </Link>
              <Link
                className="text-blue-500 underline flex justify-center my-8"
                to={`/register`}
              >
                Register
              </Link>
            </>
          }
        />
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id" element={<QuizDetail />} />
        <Route path="/quiz/:quizId/attempt" element={<QuizAttempt />} />
        <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        <Route path="/results/history/:id" element={<ResultsHistory />} />
        <Route path="/results/:resultId" element={<ResultDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
