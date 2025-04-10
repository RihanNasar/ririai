import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

const ResultPage = () => {
  const navigate = useNavigate();
  const audioUrl = sessionStorage.getItem("generatedMusicUrl");
  const prompt = sessionStorage.getItem("musicPrompt");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(new Audio(audioUrl));
  const animationRef = useRef();
  const progressBarRef = useRef(null);

  // Function to truncate prompt if it exceeds a certain length
  const truncatePrompt = (text, maxLength = 100) => {
    if (!text) return "Unknown prompt";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.load();

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => {
        setIsPlaying(false);
      });
    };
  }, []);

  const updateProgress = () => {
    const audio = audioRef.current;
    const value = (audio.currentTime / audio.duration) * 100;
    setProgress(value);
    setCurrentTime(audio.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audio.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    audioRef.current.volume = value;
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "generated_music.mp3";
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center !p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <h1 className="text-4xl font-light tracking-wider !mb-2 text-blue-300">
          YOUR SOUND IS READY
        </h1>

        <p className="text-sm !mb-6 text-gray-400 max-w-xl">
          {truncatePrompt(prompt)}
        </p>

        {/* Vinyl Record Animation */}
        <div className="!mb-6 flex justify-center relative">
          {/* Vinyl Record Container */}
          <div className="relative h-64 w-64 flex items-center justify-center">
            {/* Record shadow */}
            <div className="absolute inset-0 rounded-full bg-black shadow-2xl"></div>

            {/* Vinyl Record */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg flex items-center justify-center ${
                isPlaying ? "animate-spin-slow" : ""
              } transition-all duration-1000`}
              style={{
                backgroundImage:
                  "radial-gradient(circle, #1a1a1a 35%, transparent 35%), repeating-radial-gradient(circle, transparent, transparent 4px, rgba(80, 80, 80, 0.1) 5px, rgba(80, 80, 80, 0.1) 6px)",
              }}
            >
              {/* Light reflection */}
              <div className="absolute top-2 right-4 w-1/6 h-6 bg-white opacity-5 rounded-full transform rotate-45"></div>

              {/* Center label */}
              <div
                className="absolute inset-1/4 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, #2C5364 0%, #203A43 100%)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 5%)",
                  }}
                ></div>

                {/* Center hole */}
                <div className="w-4 h-4 rounded-full bg-black"></div>
              </div>
            </div>

            {/* Shimmering effect */}
            {isPlaying && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(130, 150, 200, 0.05), transparent)",
                  transform: "rotate(30deg)",
                  animation: "shimmer 3s infinite linear",
                }}
              ></div>
            )}

            {/* Tonearm */}
            <div
              className={`absolute -right-12 -top-8 w-40 h-40 origin-bottom-left transform ${
                isPlaying ? "rotate-30" : "rotate-12"
              } transition-transform duration-1000`}
              style={{
                transformOrigin: "20% 80%",
              }}
            >
              <div className="absolute bottom-0 left-0 w-1 h-36 bg-gray-700"></div>
              <div className="absolute bottom-0 left-0 w-8 h-1 bg-gray-700"></div>
              <div className="absolute bottom-36 left-0 w-10 h-4 rounded-sm bg-gray-800 transform -translate-x-4"></div>
              <div className="absolute bottom-36 left-0 w-1 h-6 bg-gray-600 transform -translate-x-1 -rotate-30"></div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-lg !p-6 border border-gray-800 shadow-lg">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="relative h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer !mb-3"
            onClick={handleProgressBarClick}
          >
            <div
              className="absolute h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #1A4B84, #4286f4)",
              }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 !mb-5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center !space-x-4">
              <button
                onClick={handleRestart}
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1A4B84, #4286f4)",
                }}
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-1" />
                )}
              </button>

              <div className="flex items-center !space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="bg-transparent hover:bg-blue-900 hover:bg-opacity-30 text-blue-300 text-sm rounded-full !px-4 !py-2 flex items-center !space-x-1 transition-all duration-300 border border-blue-800"
            >
              <Download size={14} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Create Another Button */}
        <div className="!mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-transparent text-blue-300 border border-blue-800 text-sm rounded-full !px-6 !py-2 transition-all duration-300 hover:bg-blue-900 hover:bg-opacity-20"
          >
            CREATE NEW
          </button>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .rotate-30 {
          transform: rotate(30deg);
        }

        .rotate-12 {
          transform: rotate(12deg);
        }

        .rotate-neg-30 {
          transform: rotate(-30deg);
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
