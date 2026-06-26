import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { ALL_PRODUCTS } from "../../data/products";

// ── Seller sidebar nav ──────────────────────────────────────────────────────
const SELLER_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "products", label: "My Products", icon: "💄" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "inventory", label: "Inventory", icon: "🏭" },
  { id: "earnings", label: "Earnings", icon: "💰" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────
const SELLER_ORDERS = [
  { id: "SUIIS12345678", customer: "Priya Sharma", product: "Velvet Noir Matte Lipstick", qty: 2, amount: 1698, status: "Delivered", date: "Apr 28" },
  { id: "SUIIS87654321", customer: "Ananya Mehta", product: "Noir Dramatique Eye Palette", qty: 1, amount: 1699, status: "Shipped", date: "May 1" },
  { id: "SUIIS11223344", customer: "Divya Rathi", product: "Luminous Skin Foundation", qty: 1, amount: 1499, status: "Processing", date: "May 2" },
  { id: "SUIIS55667788", customer: "Komal Shah", product: "Crystal Gloss Lip Treatment", qty: 3, amount: 2097, status: "Order Placed", date: "May 3" },
  { id: "SUIIS99001122", customer: "Ritu Kapoor", product: "Radiance Revival Serum", qty: 1, amount: 2299, status: "Confirmed", date: "May 4" },
  { id: "SUIIS33445566", customer: "Sneha Nair", product: "Ethereal Glow Highlighter", qty: 2, amount: 1998, status: "Delivered", date: "May 4" },
];

const MONTHLY_EARNINGS = [
  { month: "Jan", earnings: 18400 }, { month: "Feb", earnings: 24100 },
  { month: "Mar", earnings: 21800 }, { month: "Apr", earnings: 31200 },
  { month: "May", earnings: 28300 }, { month: "Jun", earnings: 35500 },
  { month: "Jul", earnings: 39100 }, { month: "Aug", earnings: 43400 },
  { month: "Sep", earnings: 37600 }, { month: "Oct", earnings: 45200 },
  { month: "Nov", earnings: 52800 }, { month: "Dec", earnings: 61600 },
];

const STATUS_COLORS = {
  "Order Placed": "#c9a96e", "Confirmed": "#c9a96e",
  "Processing": "#b8d4d8", "Shipped": "#b8d4d8",
  "Out for Delivery": "#e8a0b4", "Delivered": "#7ec88a",
  "Cancelled": "#e87070",
};

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.earnings));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
      {data.map((d) => (
        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div
            title={`${d.month}: ₹${d.earnings.toLocaleString("en-IN")}`}
            style={{
              width: "100%", height: `${(d.earnings / max) * 64}px`,
              background: "linear-gradient(to top, var(--clr-primary), var(--clr-primary-light))",
              borderRadius: "2px 2px 0 0", opacity: 0.8, cursor: "pointer",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scaleY(1)"; }}
          />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "var(--clr-text-muted)" }}>{d.month.slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sellerProducts, setSellerProducts] = useState(ALL_PRODUCTS.slice(0, 10));
  const [orders, setOrders] = useState(SELLER_ORDERS);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", category: "Lips", price: "", stock: "", description: "", image: "" });
  const [searchOrders, setSearchOrders] = useState("");
  const [editingStock, setEditingStock] = useState({});
  const { toast } = useToast();

  const totalRevenue = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length;
  const totalProducts = sellerProducts.length;

  const upd = (k, v) => setProductForm(f => ({ ...f, [k]: v }));

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.stock) { toast.error("Name, price and stock are required"); return; }
    const newP = {
      _id: "sp" + Date.now(), ...productForm,
      price: Number(productForm.price), stock: Number(productForm.stock),
      originalPrice: undefined, rating: 4.5, reviews: 0,
      isBestseller: false, isNew: true, isFeatured: false, tags: [],
    };
    setSellerProducts(prev => [newP, ...prev]);
    setProductForm({ name: "", category: "Lips", price: "", stock: "", description: "", image: "" });
    setShowAddProduct(false);
    toast.success("Product added successfully!");
  };

  const handleDeleteProduct = (id) => {
    setSellerProducts(prev => prev.filter(p => p._id !== id));
    toast.info("Product removed");
  };

  const handleStockUpdate = (id, val) => {
    setSellerProducts(prev => prev.map(p => p._id === id ? { ...p, stock: Number(val) } : p));
    setEditingStock(prev => ({ ...prev, [id]: false }));
    toast.success("Stock updated");
  };

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchOrders.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchOrders.toLowerCase()) ||
    o.product.toLowerCase().includes(searchOrders.toLowerCase())
  );

  // ── Shared panel wrapper ──────────────────────────────────────────────────
  const PanelCard = ({ children, style = {} }) => (
    <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", padding: "24px", ...style }}>
      {children}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>{children}</h2>
  );

  const Input = ({ label, value, onChange, type = "text", placeholder, full }) => (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)", fontFamily: "var(--font-body)" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 300, letterSpacing: "0.15em", color: "var(--clr-text)", textTransform: "uppercase" }}>Suiis</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--clr-accent)", marginTop: "1px" }}>Seller Panel</div>
        </div>

        {/* Seller Info */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid var(--clr-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--clr-primary)", flexShrink: 0 }}>R</div>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text)" }}>Rahul Verma</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)" }}>Verified Seller ✓</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 0", flex: 1 }}>
          {SELLER_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 20px", width: "100%", textAlign: "left",
              background: activeTab === item.id ? "rgba(201,169,110,0.1)" : "transparent",
              borderLeft: `3px solid ${activeTab === item.id ? "var(--clr-primary)" : "transparent"}`,
              border: "none", cursor: "pointer",
              color: activeTab === item.id ? "var(--clr-primary)" : "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-body)", fontSize: "13px",
              fontWeight: activeTab === item.id ? 500 : 300,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (activeTab !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; } }}
              onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; } }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Links */}
        <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "12px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
            <span>🛡</span> Admin Panel
          </Link>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "12px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
            <span>🌐</span> View Storefront
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <div style={{ padding: "18px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 300, color: "var(--clr-text)" }}>
              {SELLER_NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", marginTop: "1px" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          {activeTab === "products" && (
            <button onClick={() => setShowAddProduct(true)} style={{ padding: "10px 22px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
              + Add Product
            </button>
          )}
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ══ DASHBOARD TAB ══════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div>
              {/* KPI Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
                {[
                  { icon: "💰", label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "+18%", color: "var(--clr-primary)" },
                  { icon: "📦", label: "Total Orders", value: totalOrders, change: "+12%", color: "#7ec88a" },
                  { icon: "⏳", label: "Pending Orders", value: pendingOrders, change: null, color: "#c9a96e" },
                  { icon: "💄", label: "Products Listed", value: totalProducts, change: "+2", color: "#b8d4d8" },
                ].map(kpi => (
                  <PanelCard key={kpi.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{ fontSize: "24px" }}>{kpi.icon}</span>
                      {kpi.change && <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "2px 7px" }}>{kpi.change}</span>}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: kpi.color, marginBottom: "3px" }}>{kpi.value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{kpi.label}</div>
                  </PanelCard>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "18px", marginBottom: "18px" }}>
                {/* Earnings Chart */}
                <PanelCard>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <SectionTitle>Monthly Earnings 2025</SectionTitle>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)" }}>
                      ₹{(MONTHLY_EARNINGS.reduce((s, m) => s + m.earnings, 0) / 100000).toFixed(2)}L total
                    </span>
                  </div>
                  <MiniBarChart data={MONTHLY_EARNINGS} />
                </PanelCard>

                {/* Quick Stats */}
                <PanelCard>
                  <SectionTitle>Quick Stats</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {[
                      { label: "Conversion Rate", value: "3.8%", bar: 38, color: "#7ec88a" },
                      { label: "Return Rate", value: "2.1%", bar: 21, color: "#e87070" },
                      { label: "Avg Order Value", value: `₹${Math.round(totalRevenue / (totalOrders || 1)).toLocaleString("en-IN")}`, bar: 65, color: "var(--clr-primary)" },
                      { label: "Customer Rating", value: "4.7 ★", bar: 94, color: "#c9a96e" },
                      { label: "Stock Health", value: "Good", bar: 80, color: "#b8d4d8" },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{s.label}</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: s.color }}>{s.value}</span>
                        </div>
                        <div style={{ height: 4, background: "var(--clr-bg-3)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${s.bar}%`, background: s.color, borderRadius: 2, opacity: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </PanelCard>
              </div>

              {/* Recent Orders Preview */}
              <PanelCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <SectionTitle>Recent Orders</SectionTitle>
                  <button onClick={() => setActiveTab("orders")} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}>View All →</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {orders.slice(0, 4).map(order => (
                    <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "13px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-primary)" }}>{order.id}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.product} × {order.qty}</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)", flexShrink: 0 }}>{order.customer}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)", flexShrink: 0 }}>₹{order.amount.toLocaleString("en-IN")}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}18`, border: `1px solid ${STATUS_COLORS[order.status]}40`, padding: "3px 9px", flexShrink: 0, whiteSpace: "nowrap" }}>{order.status}</span>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </div>
          )}

          {/* ══ PRODUCTS TAB ═══════════════════════════════════════════════ */}
          {activeTab === "products" && (
            <div>
              <PanelCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <SectionTitle>My Products ({sellerProducts.length})</SectionTitle>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                    <thead>
                      <tr style={{ background: "var(--clr-bg-3)" }}>
                        {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(h => (
                          <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "13px 14px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.map(p => (
                        <tr key={p._id} style={{ borderBottom: "1px solid var(--clr-divider)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <img src={p.image} alt={p.name} style={{ width: 42, height: 42, objectFit: "cover", border: "1px solid var(--clr-border-2)", flexShrink: 0 }} />
                              <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                            </div>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", padding: "2px 7px" }}>{p.category}</span>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)" }}>₹{p.price.toLocaleString("en-IN")}</div>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            {editingStock[p._id] ? (
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <input
                                  type="number"
                                  defaultValue={p.stock}
                                  id={`stock-${p._id}`}
                                  style={{ width: 60, padding: "5px 8px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-primary)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "12px", outline: "none" }}
                                />
                                <button onClick={() => handleStockUpdate(p._id, document.getElementById(`stock-${p._id}`).value)} style={{ padding: "4px 8px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontSize: "10px", fontFamily: "var(--font-body)", fontWeight: 600 }}>✓</button>
                                <button onClick={() => setEditingStock(prev => ({ ...prev, [p._id]: false }))} style={{ padding: "4px 8px", background: "transparent", color: "#e87070", border: "1px solid rgba(232,112,112,0.3)", cursor: "pointer", fontSize: "12px" }}>×</button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: p.stock < 20 ? "#e87070" : "#7ec88a", fontWeight: 500 }}>
                                  {p.stock < 20 && "⚠ "}{p.stock}
                                </span>
                                <button onClick={() => setEditingStock(prev => ({ ...prev, [p._id]: true }))} style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)", background: "none", border: "1px solid var(--clr-border-2)", padding: "2px 6px", cursor: "pointer", transition: "all 0.2s" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-muted)"; }}>
                                  Edit
                                </button>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{p.rating}★ ({p.reviews})</span>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <Link to={`/product/${p._id}`} target="_blank" style={{ padding: "5px 10px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "11px", transition: "all 0.2s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
                                View
                              </Link>
                              <button onClick={() => handleDeleteProduct(p._id)} style={{ padding: "5px 10px", border: "1px solid rgba(232,112,112,0.3)", background: "transparent", color: "#e87070", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PanelCard>
            </div>
          )}

          {/* ══ ORDERS TAB ═════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", marginBottom: "20px" }}
                onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"}
                onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input value={searchOrders} onChange={e => setSearchOrders(e.target.value)} placeholder="Search orders by ID, customer or product..." style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)" }} />
                {searchOrders && <button onClick={() => setSearchOrders("")} style={{ color: "var(--clr-text-3)", fontSize: "16px", background: "none", border: "none", cursor: "pointer" }}>×</button>}
              </div>
              <PanelCard>
                <SectionTitle>All Orders ({filteredOrders.length})</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {filteredOrders.map(order => (
                    <div key={order.id} style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid var(--clr-divider)", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ minWidth: "130px" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--clr-primary)" }}>{order.id}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{order.date}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: "160px" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.product}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>Qty: {order.qty} · {order.customer}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--clr-primary)", flexShrink: 0 }}>₹{order.amount.toLocaleString("en-IN")}</div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, color: STATUS_COLORS[order.status] || "var(--clr-text-3)", background: `${STATUS_COLORS[order.status] || "var(--clr-bg-3)"}18`, border: `1px solid ${STATUS_COLORS[order.status] || "var(--clr-border-2)"}40`, padding: "4px 10px", flexShrink: 0, whiteSpace: "nowrap" }}>{order.status}</span>
                      <button onClick={() => { toast.info(`Processing order ${order.id}...`); }} style={{ padding: "6px 14px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s", whiteSpace: "nowrap" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>
                        Process
                      </button>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)" }}>No orders found.</div>
                  )}
                </div>
              </PanelCard>
            </div>
          )}

          {/* ══ INVENTORY TAB ══════════════════════════════════════════════ */}
          {activeTab === "inventory" && (
            <div>
              {/* Low stock alert */}
              {sellerProducts.filter(p => p.stock < 20).length > 0 && (
                <div style={{ padding: "14px 20px", background: "rgba(232,112,112,0.08)", border: "1px solid rgba(232,112,112,0.3)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>⚠️</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "#e87070" }}>Low Stock Alert</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{sellerProducts.filter(p => p.stock < 20).length} products have fewer than 20 units. Restock soon!</div>
                  </div>
                </div>
              )}
              <PanelCard>
                <SectionTitle>Inventory Overview</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--clr-divider)", border: "1px solid var(--clr-divider)", marginBottom: "24px" }}>
                  {[
                    { label: "Total SKUs", value: sellerProducts.length, color: "var(--clr-text-2)" },
                    { label: "Total Stock Units", value: sellerProducts.reduce((s, p) => s + p.stock, 0).toLocaleString("en-IN"), color: "var(--clr-primary)" },
                    { label: "Low Stock (<20)", value: sellerProducts.filter(p => p.stock < 20).length, color: "#e87070" },
                  ].map(s => (
                    <div key={s.label} style={{ padding: "18px 20px", background: "var(--clr-bg-3)", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: s.color, marginBottom: "3px" }}>{s.value}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Stock List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {sellerProducts.sort((a, b) => a.stock - b.stock).map(p => (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                      <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0, border: "1px solid var(--clr-border-2)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{p.category}</div>
                      </div>
                      {/* Stock bar */}
                      <div style={{ width: 120, flexShrink: 0 }}>
                        <div style={{ height: 4, background: "var(--clr-bg-3)", borderRadius: 2, marginBottom: "3px" }}>
                          <div style={{ height: "100%", width: `${Math.min((p.stock / 100) * 100, 100)}%`, background: p.stock < 10 ? "#e87070" : p.stock < 20 ? "#c9a96e" : "#7ec88a", borderRadius: 2, transition: "width 0.5s" }} />
                        </div>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: p.stock < 10 ? "#e87070" : p.stock < 20 ? "#c9a96e" : "#7ec88a", minWidth: "40px", textAlign: "right", flexShrink: 0 }}>
                        {p.stock}
                      </span>
                      <button
                        onClick={() => { toast.info(`Go to Products tab to edit stock for "${p.name}"`); setActiveTab("products"); }}
                        style={{ padding: "5px 12px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </div>
          )}

          {/* ══ EARNINGS TAB ═══════════════════════════════════════════════ */}
          {activeTab === "earnings" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
                {[
                  { label: "Total Earned", value: `₹${MONTHLY_EARNINGS.reduce((s, m) => s + m.earnings, 0).toLocaleString("en-IN")}`, icon: "💰", color: "var(--clr-primary)" },
                  { label: "This Month", value: `₹${MONTHLY_EARNINGS[4].earnings.toLocaleString("en-IN")}`, icon: "📅", color: "#7ec88a" },
                  { label: "Commission (12%)", value: `₹${Math.round(MONTHLY_EARNINGS.reduce((s, m) => s + m.earnings, 0) * 0.12).toLocaleString("en-IN")}`, icon: "📊", color: "#e87070" },
                ].map(k => (
                  <PanelCard key={k.label}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>{k.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: k.color, marginBottom: "3px" }}>{k.value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k.label}</div>
                  </PanelCard>
                ))}
              </div>
              <PanelCard>
                <SectionTitle>Monthly Breakdown</SectionTitle>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Month", "Gross Sales", "Commission (12%)", "Net Earnings", "Orders", "Status"].map(h => (
                        <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "0 0 14px 0", textAlign: "left", borderBottom: "1px solid var(--clr-divider)", paddingRight: "16px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHLY_EARNINGS.map((m, i) => {
                      const commission = Math.round(m.earnings * 0.12);
                      const net = m.earnings - commission;
                      const isCurrent = i === 4;
                      return (
                        <tr key={m.month} style={{ borderBottom: "1px solid var(--clr-divider)", background: isCurrent ? "rgba(201,169,110,0.04)" : "transparent" }}>
                          <td style={{ padding: "13px 16px 13px 0" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: isCurrent ? "var(--clr-primary)" : "var(--clr-text-2)", fontWeight: isCurrent ? 500 : 300 }}>{m.month} 2025</span></td>
                          <td style={{ padding: "13px 16px 13px 0" }}><span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-text)" }}>₹{m.earnings.toLocaleString("en-IN")}</span></td>
                          <td style={{ padding: "13px 16px 13px 0" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#e87070" }}>-₹{commission.toLocaleString("en-IN")}</span></td>
                          <td style={{ padding: "13px 16px 13px 0" }}><span style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)" }}>₹{net.toLocaleString("en-IN")}</span></td>
                          <td style={{ padding: "13px 16px 13px 0" }}><span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{Math.round(m.earnings / 800)}</span></td>
                          <td style={{ padding: "13px 0" }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, color: i < 4 ? "#7ec88a" : isCurrent ? "#c9a96e" : "var(--clr-text-muted)", background: i < 4 ? "rgba(126,200,138,0.1)" : isCurrent ? "rgba(201,169,110,0.1)" : "var(--clr-bg-3)", border: `1px solid ${i < 4 ? "rgba(126,200,138,0.3)" : isCurrent ? "rgba(201,169,110,0.3)" : "var(--clr-border-2)"}`, padding: "3px 8px" }}>
                              {i < 4 ? "Paid" : isCurrent ? "Processing" : "Upcoming"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </PanelCard>
            </div>
          )}

          {/* ══ ANALYTICS TAB ══════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                <PanelCard>
                  <SectionTitle>Sales by Category</SectionTitle>
                  {[
                    { cat: "Lips", pct: 32, color: "#e8a0b4" },
                    { cat: "Face", pct: 28, color: "#c9a96e" },
                    { cat: "Eyes", pct: 24, color: "#b8d4d8" },
                    { cat: "Skincare", pct: 10, color: "#7ec88a" },
                    { cat: "Others", pct: 6, color: "#9b8ec4" },
                  ].map(c => (
                    <div key={c.cat} style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{c.cat}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: c.color }}>{c.pct}%</span>
                      </div>
                      <div style={{ height: 6, background: "var(--clr-bg-3)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 3, opacity: 0.85 }} />
                      </div>
                    </div>
                  ))}
                </PanelCard>

                <PanelCard>
                  <SectionTitle>Top Selling Products</SectionTitle>
                  {sellerProducts.sort((a, b) => b.reviews - a.reviews).slice(0, 6).map((p, i) => (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)", width: 22, flexShrink: 0 }}>{i + 1}</span>
                      <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: "cover", border: "1px solid var(--clr-border-2)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--clr-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{p.reviews} sales</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-primary)", flexShrink: 0 }}>₹{p.price.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </PanelCard>

                <PanelCard>
                  <SectionTitle>Customer Insights</SectionTitle>
                  {[
                    { label: "Repeat Purchase Rate", value: "42%", icon: "🔄" },
                    { label: "Avg Customer Rating", value: "4.7 ★", icon: "⭐" },
                    { label: "Return Rate", value: "2.1%", icon: "↩" },
                    { label: "Cart Abandonment", value: "68%", icon: "🛒" },
                    { label: "Email Open Rate", value: "24%", icon: "📧" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{s.icon}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{s.label}</span>
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--clr-primary)" }}>{s.value}</span>
                    </div>
                  ))}
                </PanelCard>

                <PanelCard>
                  <SectionTitle>Performance Score</SectionTitle>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "72px", fontWeight: 300, color: "var(--clr-primary)", lineHeight: 1, marginBottom: "8px" }}>92</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Seller Score</div>
                    <div style={{ height: 8, background: "var(--clr-bg-3)", borderRadius: 4, marginBottom: "20px" }}>
                      <div style={{ height: "100%", width: "92%", background: "linear-gradient(90deg, var(--clr-primary), #7ec88a)", borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
                      {[["Shipping", "98%"], ["Quality", "95%"], ["Service", "94%"], ["Returns", "91%"]].map(([l, v]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#7ec88a" }}>{v}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PanelCard>
              </div>
            </div>
          )}

          {/* ══ SETTINGS TAB ═══════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <PanelCard>
                <SectionTitle>Store Information</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Store Name", value: "Rahul Beauty Co.", placeholder: "Your store name" },
                    { label: "Display Name", value: "Rahul Verma", placeholder: "Your full name" },
                    { label: "Business Email", value: "rahul@email.com", placeholder: "business@email.com" },
                    { label: "Phone Number", value: "9834567890", placeholder: "10-digit number" },
                    { label: "GST Number", value: "29ABCDE1234F1Z5", placeholder: "GST registration number" },
                    { label: "Store City", value: "Delhi", placeholder: "Your city" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{f.label}</label>
                      <input defaultValue={f.value} placeholder={f.placeholder}
                        style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                    </div>
                  ))}
                  <button onClick={() => toast.success("Store settings saved!")} style={{ padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "8px", transition: "background 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
                    Save Settings
                  </button>
                </div>
              </PanelCard>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <PanelCard>
                  <SectionTitle>Bank Account</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "Account Holder", value: "Rahul Verma" },
                      { label: "Bank Name", value: "HDFC Bank" },
                      { label: "Account Number", value: "•••• •••• 4521" },
                      { label: "IFSC Code", value: "HDFC0001234" },
                    ].map(f => (
                      <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{f.label}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)", fontWeight: 500 }}>{f.value}</span>
                      </div>
                    ))}
                    <button onClick={() => toast.info("Contact support to update bank details")} style={{ padding: "10px", background: "transparent", color: "var(--clr-primary)", border: "1px solid rgba(201,169,110,0.3)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s", marginTop: "6px" }}>
                      Update Bank Details
                    </button>
                  </div>
                </PanelCard>

                <PanelCard>
                  <SectionTitle>Notifications</SectionTitle>
                  {[
                    { label: "New Order Alerts", key: "orders", checked: true },
                    { label: "Low Stock Alerts", key: "stock", checked: true },
                    { label: "Payment Received", key: "payment", checked: true },
                    { label: "Review Notifications", key: "reviews", checked: false },
                    { label: "Weekly Reports", key: "reports", checked: true },
                  ].map(n => (
                    <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--clr-divider)" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{n.label}</span>
                      <div style={{ width: 40, height: 22, borderRadius: 11, background: n.checked ? "var(--clr-primary)" : "var(--clr-bg-3)", border: `1px solid ${n.checked ? "var(--clr-primary)" : "var(--clr-border-2)"}`, position: "relative", cursor: "pointer", transition: "all 0.3s" }}
                        onClick={() => toast.info("Notification preference updated")}>
                        <span style={{ position: "absolute", top: 2, left: n.checked ? 19 : 2, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.3s", display: "block" }} />
                      </div>
                    </div>
                  ))}
                </PanelCard>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Add Product Modal ── */}
      {showAddProduct && (
        <div onClick={() => setShowAddProduct(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(560px,100%)", padding: "36px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>Add New Product</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Input label="Product Name *" value={productForm.name} onChange={e => upd("name", e.target.value)} placeholder="Velvet Noir Lipstick" full />
              <Input label="Price (₹) *" value={productForm.price} onChange={e => upd("price", e.target.value)} type="number" placeholder="849" />
              <Input label="Stock *" value={productForm.stock} onChange={e => upd("stock", e.target.value)} type="number" placeholder="50" />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Category</label>
                <select value={productForm.category} onChange={e => upd("category", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }}>
                  {["Lips", "Eyes", "Face", "Skincare", "Fragrance", "Accessories", "Gift Sets"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Image URL" value={productForm.image} onChange={e => upd("image", e.target.value)} placeholder="https://images.unsplash.com/..." full />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Description</label>
                <textarea value={productForm.description} onChange={e => upd("description", e.target.value)} rows={3} placeholder="Product description..."
                  style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleAddProduct} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Add Product
              </button>
              <button onClick={() => setShowAddProduct(false)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}