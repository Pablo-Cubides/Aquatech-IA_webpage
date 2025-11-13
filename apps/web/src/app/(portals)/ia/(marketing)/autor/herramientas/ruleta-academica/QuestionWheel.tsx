"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface QuestionWheelProps {
  questions: string[];
}

const COLORS = [
  "#00efff", // primary-cyan
  "#8b5cf6", // accent-purple
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#d4a5a5",
  "#9b59b6",
  "#3498db",
  "#e67e22",
  "#2ecc71",
  "#95a5a6",
  "#e74c3c",
  "#34495e",
];

const QuestionWheel = ({ questions }: QuestionWheelProps) => {
  const [questionList, setQuestionList] = useState<string[]>(questions);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const prevIndexRef = useRef<number | null>(null);
  const [wheelSize, setWheelSize] = useState(600);
  const wheelRef = useRef<SVGSVGElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWheelSize(window.innerWidth < 768 ? 360 : 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setQuestionList(questions);
    setSelectedQuestion("");
    setSelectedIndex(null);
    setRotation(0);
  }, [questions]);

  // Focus management for modal
  useEffect(() => {
    if (isModalOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isModalOpen]);

  const handleSpin = () => {
    if (isSpinning || questionList.length === 0) return;

    setIsSpinning(true);
    setSelectedQuestion("");
    setSelectedIndex(null);

    // Choose random index
    let randomIndex = Math.floor(Math.random() * questionList.length);
    if (questionList.length > 1 && randomIndex === prevIndexRef.current) {
      randomIndex = (randomIndex + 1) % questionList.length;
    }
    prevIndexRef.current = randomIndex;

    const segmentAngle = 360 / questionList.length;
    const targetSegmentCenter = randomIndex * segmentAngle + segmentAngle / 2;

    const fastSpins = 2;
    const slowSpins = 3;
    const fastDuration = 400;
    const slowDuration = 1400;

    const currentRotation = rotation;
    const currentNorm = ((currentRotation % 360) + 360) % 360;
    const desiredNormRotation = (360 - targetSegmentCenter) % 360;
    const alignRotation = (desiredNormRotation - currentNorm + 360) % 360;
    const totalDelta = fastSpins * 360 + slowSpins * 360 + alignRotation;

    const fastPhaseDelta = fastSpins * 360;
    const slowPhaseDelta = totalDelta - fastPhaseDelta;

    let start = currentRotation;
    let end = start + fastPhaseDelta;
    let startTime: number | null = null;

    function fastSpin(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / fastDuration, 1);
      setRotation(start + (end - start) * progress);
      if (progress < 1) {
        requestAnimationFrame(fastSpin);
      } else {
        startTime = null;
        start = end;
        end = start + slowPhaseDelta;
        requestAnimationFrame(slowSpin);
      }
    }

    function slowSpin(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / slowDuration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setRotation(start + (end - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(slowSpin);
      } else {
        const finalRot = end % 360;
        setRotation(finalRot);
        setSelectedQuestion(questionList[randomIndex]);
        setSelectedIndex(randomIndex);
        setIsSpinning(false);
        setIsModalOpen(true);
      }
    }

    requestAnimationFrame(fastSpin);
  };

  const handleRemove = () => {
    if (selectedIndex !== null && questionList.length > 0) {
      const newList = questionList.filter((_, idx) => idx !== selectedIndex);
      setQuestionList(newList);
      setSelectedQuestion("");
      setSelectedIndex(null);
      setRotation(0);
      prevIndexRef.current = null;
    }
  };

  const radius = wheelSize / 2;
  const segmentAngle =
    questionList.length > 0 ? 360 / questionList.length : 360;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div
        className="text-2xl font-semibold"
        style={{ color: "var(--primary-cyan)" }}
      >
        Preguntas restantes: {questionList.length}
      </div>

      <div className="relative flex justify-center items-center">
        {/* Marker pointing down */}
        <div className="absolute z-20 top-[-15px] left-1/2 -translate-x-1/2">
          <div
            style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }}
            className="w-10 h-10 bg-white"
          />
        </div>

        <div
          className="relative rounded-full shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            width: wheelSize,
            height: wheelSize,
            border: "8px solid #fff",
            boxShadow: "0 0 30px rgba(0,0,0,0.6)",
            transition: "transform 0.1s linear",
          }}
        >
          <svg
            ref={wheelRef}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="w-full h-full rounded-full"
            style={{ transform: "rotate(-90deg)" }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g>
              {questionList.map((question, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = startAngle + segmentAngle;
                const largeArcFlag = segmentAngle <= 180 ? "0" : "1";

                const startX =
                  radius + radius * Math.cos((Math.PI * startAngle) / 180);
                const startY =
                  radius + radius * Math.sin((Math.PI * startAngle) / 180);
                const endX =
                  radius + radius * Math.cos((Math.PI * endAngle) / 180);
                const endY =
                  radius + radius * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M${radius},${radius} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;

                const isSelected = !isSpinning && selectedIndex === index;

                const textAngle = startAngle + segmentAngle / 2;
                const textRadius = radius * 0.6;
                const textX =
                  radius + textRadius * Math.cos((Math.PI * textAngle) / 180);
                const textY =
                  radius + textRadius * Math.sin((Math.PI * textAngle) / 180);

                const displayNumber = (index + 1).toString();

                return (
                  <g
                    key={index}
                    style={{ filter: isSelected ? "url(#glow)" : "none" }}
                  >
                    <path
                      d={pathData}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize={questionList.length > 20 ? "14" : "20"}
                      fontWeight="bold"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {displayNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-8 py-3 text-xl font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--primary-cyan)",
            color: "var(--background-dark)",
          }}
          onClick={handleSpin}
          disabled={isSpinning || questionList.length === 0}
        >
          {isSpinning ? "⏳ Girando..." : "🎰 Girar"}
        </button>
        <button
          className="px-8 py-3 text-xl font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#ef4444",
            color: "white",
          }}
          onClick={handleRemove}
          disabled={isSpinning || selectedIndex === null}
        >
          🗑️ Eliminar
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-2xl mx-4 p-6 rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: "var(--background-light)",
              borderColor: "var(--primary-cyan)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--primary-cyan)" }}
              >
                Pregunta{" "}
                {typeof selectedIndex === "number"
                  ? `#${selectedIndex + 1}`
                  : ""}
              </h2>
              <button
                ref={closeButtonRef}
                className="text-white/80 hover:text-white px-3 py-1 rounded-md"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <p
                className="text-xl leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedQuestion}
              </p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                }}
                onClick={() => {
                  handleRemove();
                  setIsModalOpen(false);
                }}
                disabled={isSpinning || selectedIndex === null}
              >
                Eliminar pregunta
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: "var(--primary-cyan)",
                  color: "var(--background-dark)",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionWheel;
