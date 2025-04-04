import React, { useState } from "react";
import riri from "./assets/riri.svg";
import bird from "./assets/bird.svg";
import "./App.css";
import "./index.css";

const App = () => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generating music with prompt:", prompt);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Top right text */}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-start !pt-25 ">
        {/* Logo and Bird Image Section */}
        <div className="w-full max-w-6xl mx-auto px-12 flex mb-12">
          {/* Left Section - Logo */}
          <div className="w-1/2 flex flex-col items-start justify-center">
            {/* RIRIAI Logo */}
            <div>
              <img src={riri} alt="RIRIAI Logo" className="h-28" />
              <div className="mt-4">
                <p className="text-lg tracking-[0.25em] font-light leading-loose text-gray-400">
                  Turning everything real, relaxing, rendering
                </p>
                <p className="text-lg tracking-[0.25em] font-light leading-loose text-gray-400">
                  Rlt for your inner world
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Abstract Shape */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={bird}
              alt="Abstract colorful shape"
              className="h-90 !mt-7"
            />
          </div>
        </div>

        {/* Input Form Section - Just below the logo and bird */}
        <div className="w-full max-w-6xl mx-auto ">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="eg: A soft acoustic guitar playing in the background with a hint of lo-fi beats"
              className="w-3/5  bg-transparent border border-gray-600 rounded-md !px-6 !py-4 text-white focus:outline-none focus:border-blue-500 font-light"
            />
            <button
              type="submit"
              className="bg-[#072763] text-white font-bold rounded-md !px-11 py-4 !ml-15 cursor-pointer hover:bg-blue-800 transition duration-300 tracking-wider"
            >
              GENERATE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
