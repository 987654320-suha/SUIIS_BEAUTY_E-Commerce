import React from "react";
import { useNavigate } from "react-router-dom";
import BeautyScore from "./BeautyScore";
import RecommendationCards from "./RecommendationCards";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

function MetricCard({ icon, title, value, highlight }) {
  return (
    <div
      style={{
        background: "var(--clr-bg-card)",
        border: "1px solid var(--clr-border-2)",
        padding: "18px 20px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--clr-border)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--clr-border-2)")}
    >
      <h4
        style={{
          margin: 0,
          marginBottom: "10px",
          color: "var(--clr-text-3)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {icon} {title}
      </h4>
      <h2
        style={{
          margin: 0,
          color: highlight || "var(--clr-primary)",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "26px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default function BeautyReport({ report, onRescan }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const score = report.beautyScore ?? 85;
  const routine = report.routine ?? {
    morning: ["Gentle Cleanser", "Vitamin C Serum", "Gel Moisturizer", "SPF 50 Sunscreen"],
    night: ["Gentle Cleanser", "Niacinamide Serum", "Moisturizer"],
  };
  const products = report.products ?? [];

  const conditionColor = (val, goodVals) =>
    goodVals.includes(val) ? "#7ec88a" : "var(--clr-primary)";

  const handleAddAllToCart = () => {
    if (!products.length) {
      toast.info("No products to add yet.");
      return;
    }
    products.forEach((p) => {
      addToCart({
        _id: p._id || p.name,
        name: p.name,
        price: p.price || 999,
        image: p.image,
        category: p.category || "Skincare",
      });
    });
    toast.success(`${products.length} routine products added to bag! 🛍️`);
  };

  return (
    <div style={{ width: "100%", color: "var(--clr-text)" }}>
      <BeautyScore score={score} />

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginTop: "24px",
          marginBottom: "32px",
        }}
      >
        <MetricCard icon="🌸" title="Skin Type" value={report.skinType} />
        <MetricCard icon="💧" title="Hydration" value={`${report.hydration}%`} />
        <MetricCard icon="🧴" title="Oiliness" value={`${report.oiliness}%`} />
        <MetricCard
          icon="🔴"
          title="Acne"
          value={report.acne}
          highlight={conditionColor(report.acne, ["None"])}
        />
        <MetricCard
          icon="👁"
          title="Dark Circles"
          value={report.darkCircles}
          highlight={conditionColor(report.darkCircles, ["Low"])}
        />
        <MetricCard
          icon="✨"
          title="Pigmentation"
          value={report.pigmentation}
          highlight={conditionColor(report.pigmentation, ["Low"])}
        />
        {report.pores !== undefined && (
          <MetricCard icon="🔬" title="Pore Visibility" value={`${report.pores}%`} />
        )}
        <MetricCard icon="🤖" title="AI Confidence" value={`${report.confidence}%`} highlight="#7ec88a" />
      </div>

      {/* Skincare routine */}
      <div
        style={{
          background: "var(--clr-bg-2)",
          border: "1px solid var(--clr-border-2)",
          padding: "32px",
          marginBottom: "32px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--clr-primary)",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Personalized Routine
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 300,
            color: "var(--clr-text)",
            marginBottom: "24px",
          }}
        >
          🧴 AI Skincare Routine
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--clr-text)",
                marginBottom: "12px",
              }}
            >
              Morning ☀️
            </h3>
            <ol style={{ paddingLeft: "20px", margin: 0 }}>
              {routine.morning.map((step, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--clr-text-2)",
                    lineHeight: "2",
                    fontWeight: 300,
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--clr-text)",
                marginBottom: "12px",
              }}
            >
              Night 🌙
            </h3>
            <ol style={{ paddingLeft: "20px", margin: 0 }}>
              {routine.night.map((step, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--clr-text-2)",
                    lineHeight: "2",
                    fontWeight: 300,
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <RecommendationCards products={products} />

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "32px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleAddAllToCart}
          style={{
            flex: "1 1 220px",
            padding: "15px",
            background: "var(--clr-primary)",
            color: "var(--clr-bg)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--clr-primary-light)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--clr-primary)")}
        >
          🛒 Add Full Routine to Bag
        </button>
        <button
          onClick={() => navigate("/shop")}
          style={{
            flex: "1 1 160px",
            padding: "15px",
            background: "transparent",
            color: "var(--clr-text-2)",
            border: "1px solid var(--clr-border-2)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--clr-primary)";
            e.currentTarget.style.color = "var(--clr-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--clr-border-2)";
            e.currentTarget.style.color = "var(--clr-text-2)";
          }}
        >
          Browse Shop
        </button>
        {onRescan && (
          <button
            onClick={onRescan}
            style={{
              flex: "1 1 160px",
              padding: "15px",
              background: "transparent",
              color: "var(--clr-text-3)",
              border: "1px solid var(--clr-border-2)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            🔄 Rescan
          </button>
        )}
      </div>
    </div>
  );
}
