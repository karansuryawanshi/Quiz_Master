import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg_banner.png";

const Home = () => {
  const navigate = useNavigate();

  const gradientStyle = {
    background: `radial-gradient(at 85% 40%, #f6e3c5 0px, transparent 50%),
               radial-gradient(at 68% 90%, #a0d995 0px, transparent 50%),
               radial-gradient(at 76% 8%, #6cc4a1 0px, transparent 50%),
               radial-gradient(at 9% 57%, #4cacbc 0px, transparent 50%),
               #f6e3c5`,
    minHeight: "100vh", // Example of another property
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-white"
      //   style={gradientStyle}
      style={{
        background:
          "radial-gradient(at 66% 88%, #f9f5f0 0px, transparent 50%),radial-gradient(at 40% 94%, #f2ead3 0px, transparent 50%), radial-gradient(at 88% 77%, #f4991a 0px, transparent 50%), radial-gradient(at 1% 55%, #321313 0px, transparent 50%), #f9f5f0",
      }}
    >
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#321313]/60">
        Welcome to Quiz Master
      </h1>
      <p className="text-lg md:text-xl mb-10 text-center max-w-xl text-[#321313]/60">
        Test your knowledge, challenge yourself, and track your results. Start
        practicing with exciting quizzes!
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-white text-[#321313]/60 font-semibold rounded-lg shadow-md hover:bg-gray-200 cursor-pointer"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-transparent border border-white font-semibold rounded-lg hover:bg-white hover:text-[#321313]/70 cursor-pointer text-[#321313]/60 "
        >
          login / signup
        </button>
      </div>
    </div>
  );
};

export default Home;
