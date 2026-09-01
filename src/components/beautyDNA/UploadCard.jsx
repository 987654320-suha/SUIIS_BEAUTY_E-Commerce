import React, { useRef, useState } from "react";

export default function UploadCard({
  image,
  setImage,
  selectedFile,
  setSelectedFile,
  onAnalyze,
  loading,
  error,
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleImage = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      style={{
        background: "var(--clr-bg-2)",
        border: "1px solid var(--clr-border-2)",
        borderRadius: "4px",
        padding: "44px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--clr-primary)",
            display: "block",
            marginBottom: "12px",
          }}
        >
          AI Skin Intelligence
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 300,
            color: "var(--clr-text)",
            marginBottom: "10px",
          }}
        >
          Discover Your BeautyDNA
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--clr-text-3)",
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: "420px",
            margin: "0 auto",
          }}
        >
          Upload a clear, well-lit selfie and our AI will analyze your skin
          to recommend a personalized SUIIS routine.
        </p>
      </div>

      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          display: "block",
          border: `2px dashed ${dragOver ? "var(--clr-primary)" : "var(--clr-border)"}`,
          borderRadius: "4px",
          background: dragOver ? "rgba(201,169,110,0.05)" : "var(--clr-bg-3)",
          padding: image ? "24px" : "56px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {image ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={image}
              alt="Selfie preview"
              style={{
                width: "220px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid var(--clr-border)",
              }}
            />
            <div
              style={{
                marginTop: "14px",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "var(--clr-primary)",
                letterSpacing: "0.08em",
              }}
            >
              Tap to change photo
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.7 }}>
              📷
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 400,
                color: "var(--clr-text)",
                marginBottom: "8px",
              }}
            >
              Upload Your Selfie
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--clr-text-3)",
                fontWeight: 300,
              }}
            >
              Drag & drop or click to browse
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "var(--clr-text-muted)",
                marginTop: "8px",
              }}
            >
              JPG, PNG or WEBP · Max 10MB
            </p>
          </>
        )}
      </label>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "rgba(232,112,112,0.08)",
            border: "1px solid rgba(232,112,112,0.3)",
            color: "#e87070",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* Privacy note */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          marginTop: "20px",
          padding: "12px 14px",
          background: "rgba(201,169,110,0.04)",
          border: "1px solid var(--clr-border-2)",
        }}
      >
        <span style={{ flexShrink: 0 }}>🔒</span>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "var(--clr-text-3)",
            lineHeight: 1.6,
          }}
        >
          Your photo is analyzed securely and never shared. You can delete
          your scan history anytime from your account.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onAnalyze}
        disabled={loading || !selectedFile}
        style={{
          width: "100%",
          marginTop: "24px",
          padding: "16px",
          border: "1px solid var(--clr-primary)",
          background:
            loading || !selectedFile ? "var(--clr-bg-3)" : "var(--clr-primary)",
          color: loading || !selectedFile ? "var(--clr-text-muted)" : "var(--clr-bg)",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: loading || !selectedFile ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          borderColor:
            loading || !selectedFile ? "var(--clr-border-2)" : "var(--clr-primary)",
        }}
        onMouseEnter={(e) => {
          if (!loading && selectedFile)
            e.currentTarget.style.background = "var(--clr-primary-light)";
        }}
        onMouseLeave={(e) => {
          if (!loading && selectedFile)
            e.currentTarget.style.background = "var(--clr-primary)";
        }}
      >
        {loading ? "Analyzing..." : "✨ Analyze My BeautyDNA"}
      </button>
    </div>
  );
}
