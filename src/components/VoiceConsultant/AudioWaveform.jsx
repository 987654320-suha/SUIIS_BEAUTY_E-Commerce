// ============================================================
// SUIIS BEAUTY - Live Audio Waveform Canvas Component
// Renders dynamic, glowing champagne-gold audio waveforms and sine
// pulses in real time according to voice activity & volume.
// ============================================================

import React, { useRef, useEffect } from "react";

export default function AudioWaveform({ volume = 0, isSpeaking = false, isListening = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Base amplitude scales with actual mic/speaker volume
      const activeVol = Math.max(volume, isSpeaking || isListening ? 18 : 5);
      const amp = (activeVol / 100) * (height * 0.45);

      step += isSpeaking ? 0.08 : 0.04;

      // Draw 3 layered glowing sine waves
      const waves = [
        { stroke: "rgba(201, 169, 110, 0.95)", lineWidth: 2.5, speed: 1.0, freq: 0.02 },
        { stroke: "rgba(232, 160, 180, 0.70)", lineWidth: 1.5, speed: 1.4, freq: 0.035 },
        { stroke: "rgba(232, 201, 152, 0.40)", lineWidth: 1.0, speed: 0.7, freq: 0.015 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.lineWidth = wave.lineWidth;
        ctx.strokeStyle = wave.stroke;
        ctx.shadowColor = "rgba(201, 169, 110, 0.8)";
        ctx.shadowBlur = 12;

        for (let x = 0; x < width; x++) {
          // Attenuate amplitude at edges (windowing)
          const edgeFactor = Math.sin((x / width) * Math.PI);
          const y = centerY + Math.sin(x * wave.freq + step * wave.speed) * amp * edgeFactor;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [volume, isSpeaking, isListening]);

  return (
    <div style={{ width: "100%", height: "90px", position: "relative", margin: "10px 0" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={90}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          filter: "drop-shadow(0 0 10px rgba(201, 169, 110, 0.4))",
        }}
      />
    </div>
  );
}
