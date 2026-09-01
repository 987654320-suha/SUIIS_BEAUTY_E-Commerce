// ============================================================
// SUIIS BEAUTY - High-Focus Female AI Face Avatar Component
// Displays a clear, large, prominent face close-up of Madame Suiis
// with distinct facial expressions and zero background distraction.
// ============================================================

import React from "react";

export default function VoiceAvatar({ isSpeaking = false, isListening = false, isMuted = false }) {
  // Select tight facial close-up based on state
  const faceImage = isSpeaking
    ? "/images/advisor-speaking.png"
    : isListening
    ? "/images/advisor-thinking.png"
    : "/images/advisor-idle.png";

  const statusText = isMuted
    ? "Muted"
    : isSpeaking
    ? "Madame Suiis · Speaking"
    : isListening
    ? "Madame Suiis · Listening"
    : "Madame Suiis · AI Beauty Advisor";

  const statusColor = isMuted
    ? "#9ca3af"
    : isSpeaking
    ? "#f59e0b"
    : isListening
    ? "#10b981"
    : "#c9a96e";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
      }}
    >
      {/* Prominent Facial Portrait Frame - Minimalist & Focused */}
      <div
        style={{
          position: "relative",
          width: "230px",
          height: "230px",
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${isSpeaking ? "#f59e0b" : isListening ? "#10b981" : "#c9a96e"}`,
          boxShadow: isSpeaking
            ? "0 0 30px rgba(245, 158, 11, 0.4), 0 10px 30px rgba(0, 0, 0, 0.7)"
            : isListening
            ? "0 0 25px rgba(16, 185, 129, 0.35), 0 10px 30px rgba(0, 0, 0, 0.7)"
            : "0 10px 30px rgba(0, 0, 0, 0.7)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isSpeaking ? "scale(1.03)" : "scale(1)",
          background: "#121216",
        }}
      >
        {/* High-Definition Face Image */}
        <img
          src={faceImage}
          alt="Madame Suiis Face Expressions"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 25%",
            filter: isMuted ? "grayscale(75%) brightness(0.7)" : "none",
            transition: "opacity 0.25s ease, filter 0.3s ease",
          }}
        />

        {/* Minimal Subtle Lip-Sync Soundwave when Speaking */}
        {isSpeaking && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              padding: "4px 12px",
              background: "rgba(10, 10, 14, 0.75)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: 600, marginRight: "4px" }}>
              SPEAKING
            </span>
            <div className="mini-wave" style={{ height: "10px", animationDelay: "0s" }} />
            <div className="mini-wave" style={{ height: "16px", animationDelay: "0.15s" }} />
            <div className="mini-wave" style={{ height: "8px", animationDelay: "0.3s" }} />
            <div className="mini-wave" style={{ height: "14px", animationDelay: "0.1s" }} />
          </div>
        )}

        {/* Listening Indicator Overlay */}
        {isListening && !isSpeaking && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "4px 12px",
              background: "rgba(10, 10, 14, 0.75)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "pulseDot 1s infinite" }} />
            LISTENING...
          </div>
        )}
      </div>

      {/* Clean Status Badge */}
      <div
        style={{
          marginTop: "12px",
          padding: "4px 14px",
          borderRadius: "20px",
          background: "rgba(18, 18, 22, 0.9)",
          border: `1px solid ${statusColor}44`,
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.4px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: statusColor,
            boxShadow: isSpeaking || isListening ? `0 0 8px ${statusColor}` : "none",
          }}
        />
        {statusText}
      </div>

      <style>{`
        .mini-wave {
          width: 2px;
          background: #f59e0b;
          border-radius: 1px;
          animation: waveBeat 0.5s infinite ease-in-out alternate;
        }
        @keyframes waveBeat {
          0% { height: 4px; }
          100% { height: 14px; background: #fff; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
