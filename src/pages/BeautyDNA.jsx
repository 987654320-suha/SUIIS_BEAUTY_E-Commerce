import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadCard from "../components/beautyDNA/UploadCard";
import ScanLoader from "../components/beautyDNA/ScanLoader";
import BeautyReport from "../components/beautyDNA/BeautyReport";
import { useToast } from "../context/ToastContext";
import { analyzeBeautyDNA } from "../services/aiService";

export default function BeautyDNA() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetScan = () => {
    setImage(null);
    setSelectedFile(null);
    setReport(null);
    setError("");
  };

  const analyze = async () => {
    if (!selectedFile) {
      setError("Please upload a selfie first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await analyzeBeautyDNA(selectedFile);

      if (!data || !data.success) {
        throw new Error(data?.message || "Analysis failed. Please try again.");
      }

      setReport({ ...data.report, products: data.products || [] });
      toast.success("Your BeautyDNA report is ready! ✨");
    } catch (err) {
      console.error("[BeautyDNA Scan Error]:", err);

      const status = err.response?.status;
      if (status === 401) {
        const msg = "Your session has expired. Please log in again.";
        setError(msg);
        toast.error(msg);
        navigate("/login", { state: { from: "/beauty-dna" } });
      } else {
        const msg = err.response?.data?.message || err.message || "Analysis failed. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--clr-divider)",
          background: "var(--clr-bg-2)",
          padding: "40px 40px 32px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "14px",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--clr-text-3)",
            }}
          >
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>BeautyDNA</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 300,
              color: "var(--clr-text)",
              marginBottom: "6px",
            }}
          >
            ✨ BeautyDNA™ AI Skin Analysis
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--clr-text-3)",
              fontWeight: 300,
            }}
          >
            Personalized skincare recommendations powered by AI.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 40px 80px" }}>
        {loading ? (
          <ScanLoader />
        ) : report ? (
          <BeautyReport report={report} onRescan={resetScan} />
        ) : (
          <UploadCard
            image={image}
            setImage={setImage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onAnalyze={analyze}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
