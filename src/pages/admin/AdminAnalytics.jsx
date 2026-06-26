import React, { useState } from "react";
import { AdminSidebar } from "./AdminDashboard";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 38400, orders: 89, users: 320 },
  { month: "Feb", revenue: 52100, orders: 124, users: 410 },
  { month: "Mar", revenue: 47800, orders: 108, users: 380 },
  { month: "Apr", revenue: 69200, orders: 163, users: 520 },
  { month: "May", revenue: 58300, orders: 141, users: 460 },
  { month: "Jun", revenue: 74500, orders: 178, users: 610 },
  { month: "Jul", revenue: 82100, orders: 196, users: 690 },
  { month: "Aug", revenue: 91400, orders: 218, users: 750 },
  { month: "Sep", revenue: 78600, orders: 187, users: 680 },
  { month: "Oct", revenue: 95200, orders: 227, users: 820 },
  { month: "Nov", revenue: 114800, orders: 274, users: 940 },
  { month: "Dec", revenue: 132600, orders: 316, users: 1100 },
];

const CATEGORY_DATA = [
  { name: "Face", revenue: 182400, pct: 37, color: "#c9a96e" },
  { name: "Lips", revenue: 123800, pct: 25, color: "#e8a0b4" },
  { name: "Eyes", revenue: 98600, pct: 20, color: "#b8d4d8" },
  { name: "Skincare", revenue: 59200, pct: 12, color: "#7ec88a" },
  { name: "Fragrance", revenue: 24800, pct: 5, color: "#9b8ec4" },
  { name: "Accessories + Gift", revenue: 4800, pct: 1, color: "#e8c998" },
];

const TOP_PRODUCTS_DATA = [
  { name: "Velvet Noir Matte Lipstick", category: "Lips", revenue: "₹47,200", units: 234, growth: 18 },
  { name: "Luminous Skin Foundation", category: "Face", revenue: "₹82,400", units: 521, growth: 24 },
  { name: "Noir Dramatique Eye Palette", category: "Eyes", revenue: "₹75,600", units: 445, growth: 12 },
  { name: "Radiance Revival Serum", category: "Skincare", revenue: "₹63,100", units: 389, growth: 31 },
  { name: "Pro Artistry Brush Set", category: "Accessories", revenue: "₹51,800", units: 421, growth: 9 },
  { name: "Oud & Rose Elixir EDP", category: "Fragrance", revenue: "₹48,900", units: 312, growth: 22 },
];

function BarChart({ data, metric }) {
  const maxVal = Math.max(...data.map(d => d[metric]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "160px", padding: "0 4px" }}>
      {data.map((d, i) => {
        const height = (d[metric] / maxVal) * 140;
        return (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
              <div
                title={`${d.month}: ${metric === "revenue" ? "₹" + d[metric].toLocaleString("en-IN") : d[metric]}`}
                style={{
                  width: "70%", height: `${height}px`,
                  background: `linear-gradient(to top, var(--clr-primary), var(--clr-primary-light))`,
                  borderRadius: "2px 2px 0 0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  opacity: 0.85,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scaleY(1)"; }}
              />
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "var(--clr-text-muted)", letterSpacing: "0.05em" }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data }) {
  const size = 160;
  const radius = 60;
  const cx = size / 2;
  const cy = size / 2;
  let cumulative = 0;

  const segments = data.map(d => {
    const startAngle = (cumulative / 100) * 360 - 90;
    cumulative += d.pct;
    const endAngle = (cumulative / 100) * 360 - 90;
    const start = polarToCartesian(cx, cy, radius, startAngle);
    const end = polarToCartesian(cx, cy, radius, endAngle);
    const largeArc = d.pct > 50 ? 1 : 0;
    const d_path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    return { ...d, path: d_path };
  });

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {segments.map((seg, i) => (
          <path key={i} d={seg.path} fill={seg.color} opacity={0.85}
            onMouseEnter={e => e.currentTarget.setAttribute("opacity", "1")}
            onMouseLeave={e => e.currentTarget.setAttribute("opacity", "0.85")} style={{ cursor: "pointer", transition: "opacity 0.2s" }}>
            <title>{seg.name}: {seg.pct}%</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={radius * 0.55} fill="var(--clr-bg-2)" />
        <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontFamily: "var(--font-display)", fontSize: "16px", fill: "var(--clr-text)" }}>₹4.8L</text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontFamily: "var(--font-body)", fontSize: "8px", fill: "var(--clr-text-3)", letterSpacing: "0.1em" }}>REVENUE</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-2)" }}>{d.name}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginLeft: "auto" }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("year");
  const [chartMetric, setChartMetric] = useState("revenue");

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);
  const totalUsers = MONTHLY_REVENUE.reduce((s, m) => s + m.users, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Analytics</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>Business insights for 2025</p>
          </div>
          <div style={{ display: "flex", border: "1px solid var(--clr-border-2)" }}>
            {["week", "month", "year"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: "9px 18px", background: period === p ? "var(--clr-primary)" : "transparent", color: period === p ? "var(--clr-bg)" : "var(--clr-text-3)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "capitalize", transition: "all 0.2s" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
            {[
              { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(2)}L`, change: "+22.4%", icon: "💰", color: "var(--clr-primary)" },
              { label: "Total Orders", value: totalOrders.toLocaleString("en-IN"), change: "+18.7%", icon: "📦", color: "#7ec88a" },
              { label: "New Users", value: totalUsers.toLocaleString("en-IN"), change: "+31.2%", icon: "👥", color: "#b8d4d8" },
              { label: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString("en-IN")}`, change: "+5.8%", icon: "📊", color: "var(--clr-accent)" },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{kpi.icon}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "2px 8px" }}>{kpi.change}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: kpi.color, marginBottom: "3px" }}>{kpi.value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", marginBottom: "20px" }}>
            {/* Revenue Chart */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)" }}>Monthly Performance</h2>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[["revenue", "Revenue"], ["orders", "Orders"], ["users", "Users"]].map(([m, l]) => (
                    <button key={m} onClick={() => setChartMetric(m)} style={{ padding: "5px 12px", border: `1px solid ${chartMetric === m ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: chartMetric === m ? "rgba(201,169,110,0.1)" : "transparent", color: chartMetric === m ? "var(--clr-primary)" : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>{l}</button>
                  ))}
                </div>
              </div>
              <BarChart data={MONTHLY_REVENUE} metric={chartMetric} />
              {/* Summary below chart */}
              <div style={{ display: "flex", gap: "24px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--clr-divider)" }}>
                {[
                  { l: "Best Month", v: "December" },
                  { l: "YoY Growth", v: "+22.4%" },
                  { l: "Avg Monthly", v: `₹${Math.round(totalRevenue / 12).toLocaleString("en-IN")}` },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>{s.l}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-primary)" }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>By Category</h2>
              <DonutChart data={CATEGORY_DATA} />
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--clr-divider)", display: "flex", flexDirection: "column", gap: "8px" }}>
                {CATEGORY_DATA.map(d => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{d.name}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>₹{(d.revenue / 1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Top Performing Products</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["#", "Product", "Category", "Revenue", "Units Sold", "Growth"].map(h => (
                    <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "0 0 14px 12px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS_DATA.map((p, i) => (
                  <tr key={p.name} style={{ borderBottom: "1px solid var(--clr-divider)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-primary)" }}>{i + 1}</span></td>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{p.name}</span></td>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", padding: "2px 8px" }}>{p.category}</span></td>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)" }}>{p.revenue}</span></td>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{p.units}</span></td>
                    <td style={{ padding: "13px 12px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "3px 9px" }}>+{p.growth}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Row: Conversion + Traffic */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              {
                title: "Conversion Funnel",
                items: [
                  { label: "Site Visitors", value: "48,200", pct: 100, color: "#b8d4d8" },
                  { label: "Product Views", value: "31,400", pct: 65, color: "#c9a96e" },
                  { label: "Add to Cart", value: "12,800", pct: 27, color: "#e8a0b4" },
                  { label: "Checkout Started", value: "6,200", pct: 13, color: "#7ec88a" },
                  { label: "Orders Placed", value: "2,247", pct: 5, color: "#7ec88a" },
                ]
              },
              {
                title: "Traffic Sources",
                items: [
                  { label: "Organic Search", value: "42%", pct: 42, color: "#7ec88a" },
                  { label: "Instagram", value: "28%", pct: 28, color: "#e8a0b4" },
                  { label: "Direct", value: "15%", pct: 15, color: "#c9a96e" },
                  { label: "Referral", value: "9%", pct: 9, color: "#b8d4d8" },
                  { label: "Email", value: "6%", pct: 6, color: "#9b8ec4" },
                ]
              }
            ].map(section => (
              <div key={section.title} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>{section.title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {section.items.map(item => (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{item.label}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: item.color }}>{item.value}</span>
                      </div>
                      <div style={{ height: 5, background: "var(--clr-bg-3)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3, transition: "width 0.8s ease", opacity: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}