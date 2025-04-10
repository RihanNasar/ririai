import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import riri from "../assets/riri.svg";
import bird from "../assets/bird.svg";

const HomePage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const canvasRef = useRef(null);
  const buttonPosRef = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Fun loading messages rotation
  useEffect(() => {
    if (isLoading) {
      const messages = [
        "Finding your perfect beat...",
        "Making sound waves...",
        "Composing your masterpiece...",
        "Tuning the virtual instruments...",
        "Mixing the beats...",
        "Adding sonic magic...",
        "Feeling the rhythm...",
        "Harmonizing the melody...",
        "Crafting your soundscape...",
      ];

      let messageIndex = 0;

      // Initial message
      setLoadingMessage(messages[0]);

      // Rotate through messages
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 1500);

      return () => clearInterval(messageInterval);
    }
  }, [isLoading]);

  // Store button position when component mounts and on window resize
  useEffect(() => {
    const updateButtonPosition = () => {
      const form = document.querySelector("form");
      if (form) {
        const button = form.querySelector("button");
        if (button) {
          const rect = button.getBoundingClientRect();
          buttonPosRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
      }
    };

    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => window.removeEventListener("resize", updateButtonPosition);
  }, []);

  // Snake animation when loading
  useEffect(() => {
    if (isLoading && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size to match window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Snake properties
      const snake = {
        positions: [],
        maxLength: 30,
        dotSize: 14,
        speed: 8,
        direction: Math.random() * Math.PI * 2,
        directionChangeRate: 0.07,
        startX: buttonPosRef.current.x,
        startY: buttonPosRef.current.y,
      };

      // Initialize snake at button position
      snake.positions.push({
        x: snake.startX,
        y: snake.startY,
      });

      // Music note properties
      const musicNotes = [];
      const noteTypes = ["♪", "♫", "♬", "🎵", "🎶"];
      const noteColors = [
        "#FF5E7E",
        "#7EFFFF",
        "#FFDE59",
        "#B4FF9A",
        "#D18FFF",
      ];
      let noteTimer = 0;

      let animationId;
      let frame = 0;

      const animate = () => {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate new head position
        snake.direction += (Math.random() - 0.5) * snake.directionChangeRate;

        const newX =
          snake.positions[0].x + Math.cos(snake.direction) * snake.speed;
        const newY =
          snake.positions[0].y + Math.sin(snake.direction) * snake.speed;

        // Bounce off walls
        if (newX < 0 || newX > canvas.width) {
          snake.direction = Math.PI - snake.direction;
        }
        if (newY < 0 || newY > canvas.height) {
          snake.direction = -snake.direction;
        }

        // Add new head position
        snake.positions.unshift({
          x: snake.positions[0].x + Math.cos(snake.direction) * snake.speed,
          y: snake.positions[0].y + Math.sin(snake.direction) * snake.speed,
        });

        // Remove tail if too long
        if (snake.positions.length > snake.maxLength) {
          snake.positions.pop();
        }

        // Draw snake (dots with gradient size)
        snake.positions.forEach((pos, index) => {
          const alpha = 1 - index / snake.maxLength;
          const size = snake.dotSize * (1 - (index / snake.maxLength) * 0.6);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Add glow effect for head dots
          if (index < 3) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
            ctx.fill();
          }
        });

        // Generate music notes occasionally from the snake's head
        noteTimer++;
        if (noteTimer > 15 && snake.positions.length > 0) {
          // Every 15 frames
          const randomIndex = Math.floor(Math.random() * noteTypes.length);
          musicNotes.push({
            x: snake.positions[0].x,
            y: snake.positions[0].y,
            type: noteTypes[randomIndex],
            color: noteColors[randomIndex],
            size: 16 + Math.random() * 10,
            velocity: {
              x: (Math.random() - 0.5) * 3,
              y: -1 - Math.random() * 2,
            },
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            opacity: 1,
          });
          noteTimer = 0;
        }

        // Update and draw music notes
        for (let i = musicNotes.length - 1; i >= 0; i--) {
          const note = musicNotes[i];

          // Update position
          note.x += note.velocity.x;
          note.y += note.velocity.y;
          note.rotation += note.rotationSpeed;
          note.opacity -= 0.01;

          // Remove faded notes
          if (note.opacity <= 0) {
            musicNotes.splice(i, 1);
            continue;
          }

          // Draw note
          ctx.save();
          ctx.translate(note.x, note.y);
          ctx.rotate(note.rotation);
          ctx.font = `${note.size}px Arial`;
          ctx.fillStyle = `${note.color}${Math.floor(note.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(note.type, 0, 0);
          ctx.restore();
        }

        // Draw loading progress
        const progress = (frame % 120) / 120; // Loop every 120 frames
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height - 60,
          15,
          0,
          Math.PI * 2 * progress
        );
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isLoading) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://02fa-35-245-15-18.ngrok-free.app/generate?prompt=${encodeURIComponent(
          prompt
        )}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Raw Error Response:", errorText);
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      // Store the audio URL in sessionStorage
      sessionStorage.setItem("generatedMusicUrl", audioUrl);
      sessionStorage.setItem("musicPrompt", prompt);

      console.log("✅ Music ready to play...");

      // Redirect to the result page after the music is ready
      navigate("/result");
    } catch (error) {
      console.error("❌ There was a problem with your fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-start !pt-25 ">
        {/* Logo and Bird Image Section */}
        <div className="w-full max-w-6xl mx-auto px-12 flex mb-12">
          {/* Left Section - Logo */}
          <div className="w-3/4 flex flex-col items-start justify-center">
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
        <div className="w-full max-w-6xl mx-auto flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex gap-16 w-full justify-start"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="eg: A soft acoustic guitar playing in the background with a hint of lo-fi beats"
              className="w-2/3 bg-transparent border border-gray-600 rounded-md !px-6 !py-4 text-white focus:outline-none focus:border-blue-500 font-light"
            />
            <button
              type="submit"
              className="bg-[#072763] text-white font-bold rounded-md !px-11 !py-4 hover:bg-blue-800 transition duration-300 tracking-wider"
            >
              GENERATE
            </button>
          </form>
        </div>
      </div>

      {/* Loading Overlay - Snake-like dotted line with music indicators */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          {/* Message display area */}
          <div className="absolute top-2/5 text-center">
            <div className="text-2xl font-light text-white mb-2 loading-text-pulse">
              {loadingMessage}
            </div>
            <div className="text-lg text-gray-400 mt-4">
              Processing: "{prompt}"
            </div>
          </div>

          {/* Canvas for snake and music notes */}
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
