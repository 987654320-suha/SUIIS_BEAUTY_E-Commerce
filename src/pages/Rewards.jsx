import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRewards } from "../context/RecentlyViewedContext";
import { useToast } from "../context/ToastContext";

export default function Rewards() {
  const { points, transactions, currentTier, nextTier, progressToNext, TIERS, redeemPoints } = useRewards();
  const { toast } = useToast();
  const navigate = useNavigate();

  const tierColors = { Silver: "#C0C0C0", Gold: "#FFD700", Platinum: "#E5E4E2", Diamond: "#B9F2FF" };

  const handleRedeem = (pts, label) => {
    if (pts > points) { toast.error(`Not enough points. You have ${points} pts.`); return; }
    redeemPoints(pts);
    toast.success(`Redeemed ${pts} points for ${label}!`);
  };

  const REDEEM_OPTIONS = [
    { pts: 100, label: "₹10 Off", desc: "Apply ₹10 discount on next order" },
    { pts: 250, label: "₹25 Off", desc: "Apply ₹25 discount on next order" },
    { pts: 500, label: "₹50 Off", desc: "Apply ₹50 discount on next order" },
    { pts: 1000, label: "₹100 Off", desc: "Apply ₹100 discount on next order" },
    { pts: 500, label: "Free Shipping", desc: "Free shipping on your next order" },
    { pts: 2000, label: "Free Product", desc: "Redeem for a free mini product" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link to="/profile" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Account</Link>
            <span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>Rewards</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "var(--clr-text)", marginBottom: "4px" }}>
            Rewards & Loyalty
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)" }}>
            Earn points on every purchase and unlock exclusive perks.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Points Hero Card */}
        <div style={{
          background: `linear-gradient(135deg, var(--clr-bg-2) 0%, rgba(201,169,110,0.08) 100%)`,
          border: "1px solid var(--clr-primary)",
          padding: "40px",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(201,169,110,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, right: 60, width: 150, height: 150, borderRadius: "50%", background: "rgba(201,169,110,0.04)", pointerEvents: "none" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", alignItems: "center" }}>
            {/* Points Balance */}
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "8px" }}>
                Your Points Balance
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "64px", fontWeight: 300, color: "var(--clr-primary)", lineHeight: 1 }}>
                {points.toLocaleString("en-IN")}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "6px" }}>
                = ₹{Math.floor(points / 10).toLocaleString("en-IN")} discount value
              </div>
            </div>

            {/* Tier */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "12px" }}>
                Current Tier
              </div>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `radial-gradient(circle, ${tierColors[currentTier?.name] || "#FFD700"}30, transparent)`,
                border: `2px solid ${tierColors[currentTier?.name] || "#FFD700"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px", fontSize: "32px",
              }}>
                {currentTier?.name === "Diamond" ? "💎" : currentTier?.name === "Platinum" ? "🥈" : currentTier?.name === "Gold" ? "🥇" : "🥈"}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: tierColors[currentTier?.name] || "#FFD700" }}>
                {currentTier?.name}
              </div>
            </div>

            {/* Progress to Next */}
            <div>
              {nextTier ? (
                <>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "8px" }}>
                    Progress to {nextTier.name}
                  </div>
                  <div style={{ height: 8, background: "var(--clr-bg-3)", borderRadius: 4, marginBottom: "8px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(progressToNext, 100)}%`, background: `linear-gradient(90deg, var(--clr-primary), ${tierColors[nextTier.name] || "var(--clr-primary-light)"})`, borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>
                    {points.toLocaleString("en-IN")} / {nextTier.min.toLocaleString("en-IN")} pts
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", marginTop: "4px" }}>
                    {(nextTier.min - points).toLocaleString("en-IN")} pts to {nextTier.name}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--clr-primary)", marginBottom: "8px" }}>
                    💎 Diamond
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>
                    You've reached the highest tier!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
          {/* Redeem Points */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>
              Redeem Points
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {REDEEM_OPTIONS.map((opt, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "var(--clr-bg-3)",
                  border: `1px solid ${points >= opt.pts ? "var(--clr-border-2)" : "var(--clr-border-2)"}`,
                  opacity: points >= opt.pts ? 1 : 0.5,
                  transition: "all 0.2s",
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "2px" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
                      {opt.desc}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(opt.pts, opt.label)}
                    disabled={points < opt.pts}
                    style={{
                      padding: "7px 16px",
                      background: points >= opt.pts ? "var(--clr-primary)" : "var(--clr-bg-3)",
                      color: points >= opt.pts ? "var(--clr-bg)" : "var(--clr-text-muted)",
                      border: `1px solid ${points >= opt.pts ? "var(--clr-primary)" : "var(--clr-border-2)"}`,
                      fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
                      letterSpacing: "0.1em", cursor: points >= opt.pts ? "pointer" : "not-allowed",
                      whiteSpace: "nowrap", flexShrink: 0, marginLeft: "12px",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.pts} pts
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>
              How to Earn
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {[
                { icon: "🛍️", action: "Every Purchase", pts: "10 pts per ₹100", color: "var(--clr-primary)" },
                { icon: "👤", action: "Create Account", pts: "1,000 pts", color: "#7ec88a" },
                { icon: "📝", action: "Write a Review", pts: "50 pts per review", color: "#b8d4d8" },
                { icon: "🎂", action: "Birthday Bonus", pts: "500 pts on birthday", color: "var(--clr-accent)" },
                { icon: "👥", action: "Refer a Friend", pts: "300 pts per referral", color: "#e8c998" },
                { icon: "📱", action: "Download App", pts: "200 pts", color: "#7ec88a" },
              ].map(item => (
                <div key={item.action} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{item.action}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: item.color, flexShrink: 0 }}>
                    +{item.pts}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/shop")} style={{ width: "100%", padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", transition: "background 0.3s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
              Start Earning Now →
            </button>
          </div>
        </div>

        {/* Tier Benefits */}
        <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>
            Membership Tiers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--clr-divider)" }}>
            {TIERS.map(tier => (
              <div key={tier.name} style={{
                padding: "20px",
                background: currentTier?.name === tier.name ? "rgba(201,169,110,0.06)" : "var(--clr-bg-3)",
                border: currentTier?.name === tier.name ? `2px solid ${tierColors[tier.name]}` : "2px solid transparent",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                  {tier.name === "Diamond" ? "💎" : tier.name === "Platinum" ? "🥈" : tier.name === "Gold" ? "🥇" : "🥈"}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: tierColors[tier.name], marginBottom: "4px" }}>
                  {tier.name}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)", marginBottom: "14px" }}>
                  {tier.min === 0 ? `0–${tier.max}` : tier.max === Infinity ? `${tier.min.toLocaleString()}+` : `${tier.min.toLocaleString()}–${tier.max.toLocaleString()}`} pts
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {tier.perks.map(perk => (
                    <div key={perk} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: tierColors[tier.name], flexShrink: 0 }}>✓</span>{perk}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "28px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>
            Points History
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-divider)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: tx.type === "earned" ? "rgba(126,200,138,0.12)" : "rgba(232,112,112,0.12)", border: `1px solid ${tx.type === "earned" ? "rgba(126,200,138,0.3)" : "rgba(232,112,112,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {tx.type === "earned" ? "⬆" : "⬇"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{tx.desc}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginTop: "1px" }}>{tx.date}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, color: tx.type === "earned" ? "#7ec88a" : "#e87070", flexShrink: 0 }}>
                  {tx.type === "earned" ? "+" : ""}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}