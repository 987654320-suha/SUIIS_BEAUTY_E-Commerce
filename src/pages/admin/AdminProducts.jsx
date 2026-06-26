import React, { useState } from "react";
import { AdminSidebar } from "./AdminDashboard";
import { ALL_PRODUCTS } from "../../data/products";
import { useToast } from "../../context/ToastContext";

export default function AdminProducts() {
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Lips", price: "", originalPrice: "", stock: "", description: "", image: "", isBestseller: false, isNew: false, isFeatured: false });
  const { toast } = useToast();

  const CATEGORIES = ["all", ...new Set(ALL_PRODUCTS.map(p => p.category))];
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openEdit = (p) => {
    setEditProduct(p._id);
    setForm({ name: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice || "", stock: p.stock, description: p.description || "", image: p.image, isBestseller: p.isBestseller, isNew: p.isNew, isFeatured: p.isFeatured });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", category: "Lips", price: "", originalPrice: "", stock: "", description: "", image: "", isBestseller: false, isNew: false, isFeatured: false });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) { toast.error("Name, price and stock are required"); return; }
    if (editProduct) {
      setProducts(prev => prev.map(p => p._id === editProduct ? { ...p, ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || undefined, stock: Number(form.stock) } : p));
      toast.success("Product updated!");
    } else {
      const newP = { ...form, _id: "p" + Date.now(), price: Number(form.price), originalPrice: Number(form.originalPrice) || undefined, stock: Number(form.stock), rating: 4.5, reviews: 0, tags: [] };
      setProducts(prev => [newP, ...prev]);
      toast.success("Product added!");
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.info("Product deleted");
  };

  const Toggle = ({ label, checked, onChange }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
      <button type="button" onClick={() => onChange(!checked)} style={{ width: 36, height: 20, borderRadius: 10, background: checked ? "var(--clr-primary)" : "var(--clr-bg-3)", border: `1px solid ${checked ? "var(--clr-primary)" : "var(--clr-border-2)"}`, position: "relative", cursor: "pointer", transition: "all 0.3s" }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.3s" }} />
      </button>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{label}</span>
    </label>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Products</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>{filtered.length} of {products.length} products</p>
          </div>
          <button onClick={openAdd} style={{ padding: "10px 22px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            + Add Product
          </button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", flex: "1 1 200px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)" }} />
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: "10px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", cursor: "pointer", minWidth: "160px" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--clr-bg-3)" }}>
                  {["Product", "Category", "Price", "Stock", "Status", "Rating", "Actions"].map(h => (
                    <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "14px 16px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product._id} style={{ borderBottom: "1px solid var(--clr-divider)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={product.image} alt={product.name} style={{ width: 44, height: 44, objectFit: "cover", flexShrink: 0, border: "1px solid var(--clr-border-2)" }} />
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{product._id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", border: "1px solid var(--clr-border-2)", padding: "3px 8px" }}>{product.category}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)" }}>₹{product.price.toLocaleString("en-IN")}</div>
                      {product.originalPrice && <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>₹{product.originalPrice.toLocaleString("en-IN")}</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: product.stock < 20 ? "#e87070" : "#7ec88a", fontWeight: 500 }}>
                        {product.stock < 20 && "⚠ "}{product.stock}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {product.isBestseller && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, color: "var(--clr-primary)", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", padding: "2px 6px" }}>Best</span>}
                        {product.isNew && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, color: "var(--clr-accent)", background: "rgba(232,160,180,0.1)", border: "1px solid rgba(232,160,180,0.3)", padding: "2px 6px" }}>New</span>}
                        {product.isFeatured && <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, color: "#b8d4d8", background: "rgba(184,212,216,0.1)", border: "1px solid rgba(184,212,216,0.3)", padding: "2px 6px" }}>Featured</span>}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{product.rating}★ ({product.reviews})</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEdit(product)} style={{ padding: "5px 12px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>Edit</button>
                        <button onClick={() => handleDelete(product._id)} style={{ padding: "5px 10px", border: "1px solid rgba(232,112,112,0.4)", background: "transparent", color: "#e87070", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,112,112,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(600px, 100%)", padding: "36px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { k: "name", l: "Product Name *", p: "Velvet Noir Lipstick", full: true },
                  { k: "price", l: "Price (₹) *", p: "849", type: "number" },
                  { k: "originalPrice", l: "Original Price (₹)", p: "1200", type: "number" },
                  { k: "stock", l: "Stock *", p: "50", type: "number" },
                ].map(f => (
                  <div key={f.k} style={f.full ? { gridColumn: "1/-1" } : {}}>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{f.l}</label>
                    <input type={f.type || "text"} value={form[f.k]} onChange={e => upd(f.k, e.target.value)} placeholder={f.p}
                      style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                  </div>
                ))}
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Category</label>
                  <select value={form.category} onChange={e => upd("category", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }}>
                    {["Lips", "Eyes", "Face", "Skincare", "Fragrance", "Accessories", "Gift Sets"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Image URL</label>
                  <input value={form.image} onChange={e => upd("image", e.target.value)} placeholder="https://images.unsplash.com/..."
                    style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Description</label>
                  <textarea value={form.description} onChange={e => upd("description", e.target.value)} rows={3} placeholder="Product description..."
                    style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
                </div>
                <div style={{ gridColumn: "1/-1", display: "flex", gap: "24px" }}>
                  <Toggle label="Bestseller" checked={form.isBestseller} onChange={v => upd("isBestseller", v)} />
                  <Toggle label="New Arrival" checked={form.isNew} onChange={v => upd("isNew", v)} />
                  <Toggle label="Featured" checked={form.isFeatured} onChange={v => upd("isFeatured", v)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button onClick={handleSave} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
                <button onClick={() => setShowForm(false)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}