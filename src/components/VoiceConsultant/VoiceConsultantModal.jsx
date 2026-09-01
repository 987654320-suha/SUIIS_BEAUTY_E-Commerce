// ============================================================
// SUIIS BEAUTY - Premium AI Voice Beauty Consultant Modal
// High-end glassmorphic consultation suite with voice synthesis,
// speech recognition, dynamic visualizer, selfie skin analysis,
// real-time site control, comparison mode & function calling.
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import voiceEngine from "../../services/voiceEngine";
import functionDispatcher from "../../services/functionDispatcher";
import websiteController from "../../services/websiteController";
import AudioWaveform from "./AudioWaveform";
import VoiceAvatar from "./VoiceAvatar";

const SKIN_CONCERNS = [
  "Acne", "Pigmentation", "Dryness", "Dark circles", "Hair fall", "Anti-aging", "Sensitive skin"
];

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];

export default function VoiceConsultantModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const cartContext = useCart();
  const { toast } = useToast();

  // State
  const [messages, setMessages] = useState([
    {
      id: "initial-greet",
      sender: "ai",
      text: "Hello darling! I'm Madame Suiis, your personal AI beauty consultant. I'm here to analyze your skin, formulate bespoke routines, and match luxury formulations to your skin goals. How may I assist you today?",
      proactiveQuestions: ["Find products for my skin type", "Build a customized AM/PM routine", "Book 1-on-1 VIP consultation"],
      timestamp: new Date(),
    },
  ]);
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);

  // Recommendations & Control State
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Selfie Scanner State
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [isScanningSelfie, setIsScanningSelfie] = useState(false);
  const [selfieReport, setSelfieReport] = useState(null);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: "", time: "16:00", topic: "Skin & Hair Consultation" });

  const transcriptEndRef = useRef(null);

  // Set up navigator & cart context in website controller
  useEffect(() => {
    websiteController.setNavigator(navigate);
    websiteController.setCartContext(cartContext);
    functionDispatcher.loadStoredMemory();
  }, [navigate, cartContext]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText]);

  // Initialize Voice Engine listeners
  useEffect(() => {
    if (!isOpen) {
      voiceEngine.stopListening();
      voiceEngine.stopSpeaking();
      return;
    }

    // Connect callbacks
    voiceEngine.onSpeechStateChange = ({ isListening, isSpeaking, isMuted }) => {
      setIsListening(isListening);
      setIsSpeaking(isSpeaking);
      setIsMuted(isMuted);
    };

    voiceEngine.onVolumeChange = (vol) => {
      setVolume(vol);
    };

    voiceEngine.onTranscriptUpdate = (text, isFinal, isUser) => {
      if (isUser) {
        if (!isFinal) {
          setInterimText(text);
        } else {
          setInterimText("");
          handleUserSpeechInput(text);
        }
      }
    };

    // Greet user on first launch
    voiceEngine.startListening();
    voiceEngine.speak("Hello darling! I'm Madame Suiis, your personal AI beauty consultant. How may I assist you today?");

    return () => {
      voiceEngine.stopListening();
      voiceEngine.stopSpeaking();
    };
  }, [isOpen]);

  // Handle Natural Speech Input from User
  const handleUserSpeechInput = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now() + "-user",
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Process through function dispatcher
    const result = functionDispatcher.processUserSpeech(text);

    const aiMsg = {
      id: Date.now() + "-ai",
      sender: "ai",
      text: result.aiResponse,
      proactiveQuestions: result.proactiveQuestions || [],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);

    // Update products overlay if products were retrieved
    if (result.functionCall && result.functionCall.products) {
      setRecommendedProducts(result.functionCall.products);
    }

    // Trigger AI Voice Output
    voiceEngine.speak(result.aiResponse);
  };

  // Quick Action Button Trigger (e.g. user clicks "Acne" or "Dryness")
  const handleQuickConcernSelect = (concern) => {
    handleUserSpeechInput(`I want to treat ${concern}`);
  };

  const handleQuickSkinTypeSelect = (skinType) => {
    handleUserSpeechInput(`My skin type is ${skinType}`);
  };

  // Add Product to Cart Action
  const handleAddToCart = (product) => {
    functionDispatcher.addToCart({ productId: product._id }, cartContext);
    toast.success(`Added ${product.name} to bag ✨`);
    voiceEngine.speak(`I've added ${product.name} to your cart.`);
  };

  // Toggle Product in Comparison Mode
  const handleToggleCompare = (product) => {
    setComparisonProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) return prev.filter((p) => p._id === product._id);
      if (prev.length >= 3) {
        toast.info("You can compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
    setShowComparisonModal(true);
  };

  // Handle Selfie Image Upload & AI Computer Vision Scan
  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelfiePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const runSelfieScan = () => {
    if (!selfieFile && !selfiePreview) {
      toast.error("Please select a selfie photo first.");
      return;
    }

    setIsScanningSelfie(true);

    setTimeout(() => {
      const scanResult = functionDispatcher.analyzeSelfie();
      setSelfieReport(scanResult);
      setIsScanningSelfie(false);

      if (scanResult.products) {
        setRecommendedProducts(scanResult.products);
      }

      toast.success("Skin Analysis Complete! ✨");
      voiceEngine.speak(
        `Selfie analysis complete! Your skin is primarily ${scanResult.report.skinType} with ${scanResult.report.scores.hydration}% hydration. I've created a custom routine for you.`
      );
    }, 2200);
  };

  // Handle Consultation Booking
  const handleBookConsultation = (e) => {
    e.preventDefault();
    const result = functionDispatcher.bookConsultation(bookingDetails);
    setShowBookingModal(false);
    toast.success(`Consultation Reserved! Reference: ${result.booking.id}`);
    voiceEngine.speak(
      `Your 1-on-1 private consultation has been booked for ${result.booking.date}. We look forward to crafting your bespoke regimen!`
    );
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8, 8, 10, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        color: "var(--clr-text)",
        animation: "modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Full-screen Consultation Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          height: "92vh",
          margin: "0 24px",
          background: "rgba(20, 20, 24, 0.75)",
          border: "1px solid rgba(201, 169, 110, 0.3)",
          borderRadius: "24px",
          display: "grid",
          gridTemplateRows: "72px 1fr auto",
          overflow: "hidden",
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.9), 0 0 50px rgba(201, 169, 110, 0.15)",
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 10, 12, 0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "22px" }}>👑</span>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "var(--clr-text)",
                  lineHeight: 1.1,
                }}
              >
                Suiis Beauty Advisor AI
              </h2>
              <span style={{ fontSize: "11px", color: "var(--clr-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Voice-Controlled Luxury Suite
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setShowSelfieModal(true)}
              style={actionBtnStyle}
              title="Upload Selfie for Skin Analysis"
            >
              📷 Selfie Skin Scan
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              style={actionBtnStyle}
              title="Book 1-on-1 Masterclass"
            >
              📅 Book Masterclass
            </button>

            <button
              onClick={() => voiceEngine.toggleMute()}
              style={{
                ...actionBtnStyle,
                borderColor: isMuted ? "rgba(239, 68, 68, 0.6)" : "rgba(201, 169, 110, 0.4)",
                color: isMuted ? "#ef4444" : "var(--clr-primary)",
              }}
            >
              {isMuted ? "🔇 Unmute Mic" : "🎙️ Mic Active"}
            </button>

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--clr-text-3)",
                fontSize: "24px",
                cursor: "pointer",
                padding: "8px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr 340px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* LEFT COLUMN: ANIMATED AVATAR & PROACTIVE CONTROLS */}
          <div
            style={{
              padding: "24px",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(12, 12, 14, 0.4)",
            }}
          >
            <div style={{ textAlign: "center", width: "100%" }}>
              <VoiceAvatar isSpeaking={isSpeaking} isListening={isListening} isMuted={isMuted} />
              
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--clr-primary)", marginBottom: "4px" }}>
                {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Standing By"}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--clr-text-3)", marginBottom: "16px" }}>
                Speak naturally or select options below
              </p>

              <AudioWaveform volume={volume} isSpeaking={isSpeaking} isListening={isListening} />
            </div>

            {/* Quick Questionnaire Pills */}
            <div style={{ width: "100%" }}>
              <span style={sectionTagStyle}>Select Skin Concern</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {SKIN_CONCERNS.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleQuickConcernSelect(c)}
                    style={pillBtnStyle}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <span style={sectionTagStyle}>Select Skin Type</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SKIN_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleQuickSkinTypeSelect(t)}
                    style={{ ...pillBtnStyle, borderColor: "rgba(232, 160, 180, 0.3)", color: "var(--clr-accent)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: LIVE TRANSCRIPT & CONVERSATION */}
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <span style={{ ...sectionTagStyle, marginBottom: "12px" }}>Live Audio Transcript</span>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    padding: "16px 20px",
                    borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    background: msg.sender === "user" 
                      ? "linear-gradient(135deg, rgba(201,169,110,0.25) 0%, rgba(154,122,74,0.3) 100%)" 
                      : "rgba(255, 255, 255, 0.05)",
                    border: msg.sender === "user" 
                      ? "1px solid rgba(201,169,110,0.4)" 
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--clr-primary)", marginBottom: "4px", fontWeight: 600 }}>
                    {msg.sender === "user" ? "You" : "Suiis Beauty Advisor"}
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--clr-text)" }}>
                    {msg.text}
                  </div>

                  {/* Proactive Follow-up Questions */}
                  {msg.proactiveQuestions && msg.proactiveQuestions.length > 0 && (
                    <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--clr-text-3)", letterSpacing: "0.1em" }}>
                        Suggested Follow-ups:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                        {msg.proactiveQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUserSpeechInput(q)}
                            style={{
                              padding: "4px 10px",
                              fontSize: "11px",
                              background: "rgba(201, 169, 110, 0.12)",
                              border: "1px solid rgba(201, 169, 110, 0.3)",
                              borderRadius: "12px",
                              color: "var(--clr-primary-light)",
                              cursor: "pointer",
                            }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {interimText && (
                <div
                  style={{
                    alignSelf: "flex-end",
                    padding: "12px 18px",
                    borderRadius: "16px",
                    background: "rgba(201, 169, 110, 0.1)",
                    border: "1px dashed rgba(201, 169, 110, 0.4)",
                    fontSize: "13px",
                    color: "var(--clr-primary-light)",
                    fontStyle: "italic",
                  }}
                >
                  Listening: "{interimText}..."
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* RIGHT COLUMN: RECOMMENDED PRODUCTS CAROUSEL & ACTIONS */}
          <div
            style={{
              padding: "24px",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(12, 12, 14, 0.4)",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={sectionTagStyle}>Real-time Matches ({recommendedProducts.length})</span>
              {comparisonProducts.length > 0 && (
                <button
                  onClick={() => setShowComparisonModal(true)}
                  style={{ fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Compare ({comparisonProducts.length})
                </button>
              )}
            </div>

            {recommendedProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--clr-text-3)", fontSize: "13px" }}>
                <span style={{ fontSize: "32px", display: "block", marginBottom: "10px" }}>🛍️</span>
                Speak to the AI to receive personalized luxury recommendations.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {recommendedProducts.map((prod) => (
                  <div
                    key={prod._id}
                    data-product-id={prod._id}
                    style={{
                      background: "rgba(24, 24, 28, 0.8)",
                      border: "1px solid rgba(201, 169, 110, 0.25)",
                      borderRadius: "16px",
                      padding: "14px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px" }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "10px", color: "var(--clr-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {prod.subcategory || prod.category}
                        </span>
                        <h4 style={{ fontSize: "14px", fontWeight: 500, color: "var(--clr-text)", lineHeight: 1.2, margin: "2px 0 4px" }}>
                          {prod.name}
                        </h4>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--clr-primary)" }}>
                          ₹{prod.price} <span style={{ fontSize: "11px", textDecoration: "line-through", color: "var(--clr-text-3)" }}>₹{prod.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* WHY Explanation */}
                    {prod.why && (
                      <div
                        style={{
                          margin: "10px 0 12px",
                          padding: "8px 10px",
                          background: "rgba(201, 169, 110, 0.08)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "var(--clr-text-2)",
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>Why:</strong> {prod.why}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "var(--clr-primary)",
                          color: "#0a0a0a",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        + Add to Bag
                      </button>

                      <button
                        onClick={() => handleToggleCompare(prod)}
                        style={{
                          padding: "8px 12px",
                          background: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "var(--clr-text)",
                          cursor: "pointer",
                        }}
                      >
                        ⚖️ Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM INPUT BAR */}
        <div
          style={{
            padding: "16px 32px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 10, 12, 0.7)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Type your message or speak naturally..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleUserSpeechInput(e.target.value);
                e.target.value = "";
              }
            }}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(201, 169, 110, 0.25)",
              borderRadius: "9999px",
              color: "var(--clr-text)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={() => voiceEngine.startListening()}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #e8c998 0%, #c9a96e 100%)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(201, 169, 110, 0.4)",
            }}
          >
            🎙️ Voice Input
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: COMPARISON DRAWER */}
      {/* ============================================================ */}
      {showComparisonModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9500,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              background: "#141416",
              border: "1px solid var(--clr-primary)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--clr-primary)" }}>
                Product Comparison Mode
              </h3>
              <button
                onClick={() => setShowComparisonModal(false)}
                style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${comparisonProducts.length || 1}, 1fr)`, gap: "16px" }}>
              {comparisonProducts.map((p) => (
                <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }} />
                  <h4 style={{ fontSize: "16px", color: "white", margin: "10px 0 4px" }}>{p.name}</h4>
                  <div style={{ color: "var(--clr-primary)", fontWeight: 600 }}>₹{p.price}</div>
                  <p style={{ fontSize: "12px", color: "var(--clr-text-2)", margin: "10px 0" }}>{p.description}</p>
                  <div style={{ fontSize: "11px", color: "var(--clr-primary-light)" }}>
                    <strong>Key Benefits:</strong> {p.benefits ? p.benefits.join(", ") : "Hydration & radiance"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SELFIE SKIN SCANNER */}
      {/* ============================================================ */}
      {showSelfieModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9600,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "#141416",
              border: "1px solid var(--clr-primary)",
              borderRadius: "24px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--clr-primary)" }}>
                📷 AI Selfie Skin Analysis
              </h3>
              <button onClick={() => setShowSelfieModal(false)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--clr-text-3)", marginBottom: "20px" }}>
              Upload a clear photo to scan hydration, acne, dark circles, pigmentation, and pores.
            </p>

            <div
              style={{
                border: "2px dashed rgba(201, 169, 110, 0.4)",
                borderRadius: "16px",
                padding: "30px",
                marginBottom: "20px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {selfiePreview ? (
                <img src={selfiePreview} alt="Selfie preview" style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "12px" }} />
              ) : (
                <label style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: "40px" }}>📸</div>
                  <span style={{ fontSize: "14px", color: "var(--clr-primary)" }}>Click to Choose Selfie File</span>
                  <input type="file" accept="image/*" onChange={handleSelfieUpload} style={{ display: "none" }} />
                </label>
              )}
            </div>

            {isScanningSelfie ? (
              <div style={{ color: "var(--clr-primary)", fontSize: "14px" }}>
                ✨ Scanning skin hydration, acne & tone... Please wait.
              </div>
            ) : (
              <button
                onClick={runSelfieScan}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "var(--clr-primary)",
                  color: "#0a0a0a",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Analyze Skin Now
              </button>
            )}

            {selfieReport && (
              <div style={{ marginTop: "24px", textAlign: "left", background: "rgba(201,169,110,0.1)", padding: "16px", borderRadius: "12px" }}>
                <h4 style={{ color: "var(--clr-primary)", marginBottom: "8px" }}>Skin Score Breakdown:</h4>
                <div style={{ fontSize: "13px" }}>Hydration: {selfieReport.report.scores.hydration}%</div>
                <div style={{ fontSize: "13px" }}>Clarity: {selfieReport.report.scores.clarity}%</div>
                <div style={{ fontSize: "13px", marginTop: "8px" }}>Skin Type: <strong>{selfieReport.report.skinType}</strong></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: 1-ON-1 MASTERCLASS BOOKING */}
      {/* ============================================================ */}
      {showBookingModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9700,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleBookConsultation}
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#141416",
              border: "1px solid var(--clr-primary)",
              borderRadius: "24px",
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--clr-primary)" }}>
                📅 Reserve VIP Masterclass
              </h3>
              <button type="button" onClick={() => setShowBookingModal(false)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--clr-text-3)", display: "block", marginBottom: "4px" }}>Preferred Date</label>
                <input
                  type="date"
                  required
                  onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--clr-text-3)", display: "block", marginBottom: "4px" }}>Consultation Topic</label>
                <select
                  onChange={(e) => setBookingDetails({ ...bookingDetails, topic: e.target.value })}
                  style={formInputStyle}
                >
                  <option value="Skincare Routine Building">Bespoke Skincare Routine</option>
                  <option value="Acne & Pigmentation Mastery">Acne & Dark Spot Mastery</option>
                  <option value="Luxury Bridal Makeup Consultation">Luxury Bridal Makeup</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  padding: "14px",
                  background: "var(--clr-primary)",
                  color: "#0a0a0a",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm VIP Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ========== REUSABLE STYLES ==========
const actionBtnStyle = {
  padding: "8px 14px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "9999px",
  fontSize: "12px",
  color: "var(--clr-primary)",
  cursor: "pointer",
};

const sectionTagStyle = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--clr-primary)",
  fontWeight: 600,
};

const pillBtnStyle = {
  padding: "6px 12px",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(201, 169, 110, 0.25)",
  borderRadius: "9999px",
  fontSize: "11px",
  color: "var(--clr-text-2)",
  cursor: "pointer",
};

const formInputStyle = {
  width: "100%",
  padding: "12px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "8px",
  color: "white",
  outline: "none",
};
