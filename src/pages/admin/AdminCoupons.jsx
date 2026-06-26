import React, { useState } from "react";
import { AdminSidebar } from "./AdminDashboard";
import { useToast } from "../../context/ToastContext";

const INIT_COUPONS = [
  { id: "c1", code: "SUIIS20", type: "percentage", value: 20, minOrder: 0, uses: 1247, maxUses: 5000, active: true, expiry: "Dec 31, 2025", desc: "20% off sitewide — welcome offer" },
  { id: "c2", code: "BEAUTY10", type: "percentage", value: 10, minOrder: 500, uses: 893, maxUses: null, active: true, expiry: "Dec 31, 2025", desc: "10% off on orders above ₹500" },
  { id: "c3", code: "FIRST15", type: "percentage", value: 15, minOrder: 0, uses: 2145, maxUses: null, active: true, expiry: "Dec 31, 2025", desc: "15% off for first-time customers" },
  { id: "c4", code: "FREESHIP", type: "shipping", value: 0, minOrder: 0, uses: 567, maxUses: 1000, active: true, expiry: "Jun 30, 2025", desc: "Free shipping on any order" },
  { id: "c5", code: "WEDDING25", type: "percentage", value: 25, minOrder: 3000, uses: 89, maxUses: 200, active: true, expiry: "Jun 30, 2025", desc: "25% off bridal collection" },
  { id: "c6", code: "FLAT500", type: "flat", value: 500, minOrder: 2000, uses: 234, maxUses: 500, active: false, expiry: "Mar 31, 2025", desc: "₹500 flat off on orders above ₹2000" },
  { id: "c7", code: "SUMMER30", type: "percentage", value: 30, minOrder: 1000, uses: 0, maxUses: 300, active: false, expiry: "Jul 31, 2025", desc: "Summer sale — 30% off" },
];

const EMPTY_FORM = { code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiry: "", desc: "", active: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(INIT_COUPONS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toast } = useToast();

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = coupons.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "active" ? c.active : !c.active;
    return matchSearch && matchFilter;
  });

  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, maxUses: c.maxUses || "", expiry: c.expiry, desc: c.desc, active: c.active });
    setShowForm(true);
  };

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); };

  const handleSave = () => {
    if (!form.code || !form.value) { toast.error("Code and value are required"); return; }
    if (editId) {
      setCoupons(prev => prev.map(c => c.id === editId ? { ...c, ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUses: form.maxUses ? Number(form.maxUses) : null } : c));
      toast.success("Coupon updated!");
    } else {
      const newC = { ...form, id: "c" + Date.now(), value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUses: form.maxUses ? Number(form.maxUses) : null, uses: 0 };
      setCoupons(prev => [newC, ...prev]);
      toast.success("Coupon created!");
    }
    setShowForm(false);
  };

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    const c = coupons.find(c => c.id === id);
    toast.success(`Coupon ${c.code} ${c.active ? "deactivated" : "activated"}`);
  };

  const deleteCoupon = (id) => { setCoupons(prev => prev.filter(c => c.id !== id)); toast.info("Coupon deleted"); };

  const typeLabel = (type, value) => {
    if (type === "percentage") return `${value}% Off`;
    if (type === "flat") return `₹${value} Off`;
    if (type === "shipping") return "Free Shipping";
    return value;
  };

  const Input = ({ label, k, type = "text", placeholder }) => (
    <div>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{label}</label>
      <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Coupons</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>{coupons.filter(c => c.active).length} active · {coupons.length} total</p>
          </div>
          <button onClick={openAdd} style={{ padding: "10px 22px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>+ Create Coupon</button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { l: "Total Coupons", v: coupons.length, c: "var(--clr-text-2)" },
              { l: "Active", v: coupons.filter(c => c.active).length, c: "#7ec88a" },
              { l: "Total Uses", v: coupons.reduce((s, c) => s + c.uses, 0).toLocaleString("en-IN"), c: "var(--clr-primary)" },
              { l: "Inactive", v: coupons.filter(c => !c.active).length, c: "#e87070" },
            ].map(s => (
              <div key={s.l} style={{ padding: "16px 18px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", color: s.c, marginBottom: "2px" }}>{s.v}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", flex: 1 }} onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"} onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coupons..." style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)" }} />
            </div>
            <div style={{ display: "flex", border: "1px solid var(--clr-border-2)" }}>
              {["all", "active", "inactive"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "10px 18px", background: filter === f ? "var(--clr-primary)" : "transparent", color: filter === f ? "var(--clr-bg)" : "var(--clr-text-3)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "capitalize", transition: "all 0.2s" }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Coupons Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
            {filtered.map(c => (
              <div key={c.id} style={{ background: "var(--clr-bg-2)", border: `1px solid ${c.active ? "var(--clr-border-2)" : "rgba(232,112,112,0.2)"}`, padding: "22px", position: "relative", transition: "border-color 0.2s", opacity: c.active ? 1 : 0.7 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "20px", fontWeight: 700, color: "var(--clr-primary)", letterSpacing: "0.12em" }}>{c.code}</div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: c.active ? "#7ec88a" : "#e87070", background: c.active ? "rgba(126,200,138,0.1)" : "rgba(232,112,112,0.1)", border: `1px solid ${c.active ? "rgba(126,200,138,0.3)" : "rgba(232,112,112,0.3)"}`, padding: "2px 8px" }}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--clr-text)", marginBottom: "2px" }}>{typeLabel(c.type, c.value)}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{c.desc}</div>
                  </div>
                  {/* Toggle */}
                  <button onClick={() => toggleActive(c.id)} style={{ width: 44, height: 24, borderRadius: 12, background: c.active ? "var(--clr-primary)" : "var(--clr-bg-3)", border: `1px solid ${c.active ? "var(--clr-primary)" : "var(--clr-border-2)"}`, position: "relative", cursor: "pointer", transition: "all 0.3s", flexShrink: 0 }}>
                    <span style={{ position: "absolute", top: 2, left: c.active ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", display: "block" }} />
                  </button>
                </div>

                {/* Stats Row */}
                <div style={{ display: "flex", gap: "16px", padding: "12px 0", borderTop: "1px solid var(--clr-divider)", borderBottom: "1px solid var(--clr-divider)", marginBottom: "14px" }}>
                  {[
                    { l: "Uses", v: c.uses.toLocaleString("en-IN") + (c.maxUses ? ` / ${c.maxUses.toLocaleString("en-IN")}` : "") },
                    { l: "Min Order", v: c.minOrder > 0 ? `₹${c.minOrder}` : "No minimum" },
                    { l: "Expires", v: c.expiry },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-muted)", marginBottom: "2px" }}>{s.l}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Usage Progress */}
                {c.maxUses && (
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)" }}>Usage Progress</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)" }}>{Math.round((c.uses / c.maxUses) * 100)}%</span>
                    </div>
                    <div style={{ height: 4, background: "var(--clr-bg-3)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${Math.min((c.uses / c.maxUses) * 100, 100)}%`, background: c.uses / c.maxUses > 0.8 ? "#e87070" : "var(--clr-primary)", borderRadius: 2, transition: "width 0.5s" }} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(c)} style={{ flex: 1, padding: "8px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>Edit</button>
                  <button onClick={() => { navigator.clipboard?.writeText(c.code); toast.success(`Copied "${c.code}" to clipboard!`); }} style={{ padding: "8px 14px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>📋</button>
                  <button onClick={() => deleteCoupon(c.id)} style={{ padding: "8px 14px", border: "1px solid rgba(232,112,112,0.3)", background: "transparent", color: "#e87070", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", transition: "all 0.2s" }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(540px,100%)", padding: "36px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>{editId ? "Edit Coupon" : "Create New Coupon"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ gridColumn: "1/-1" }}><Input label="Coupon Code *" k="code" placeholder="SUIIS20" /></div>

                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Discount Type</label>
                  <select value={form.type} onChange={e => upd("type", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }}>
                    <option value="percentage">Percentage %</option>
                    <option value="flat">Flat Amount ₹</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>

                <Input label={form.type === "percentage" ? "Discount % *" : form.type === "flat" ? "Amount ₹ *" : "Value (enter 0)"} k="value" type="number" placeholder={form.type === "percentage" ? "20" : "500"} />
                <Input label="Min Order Amount (₹)" k="minOrder" type="number" placeholder="0" />
                <Input label="Max Uses (blank = unlimited)" k="maxUses" type="number" placeholder="1000" />
                <Input label="Expiry Date" k="expiry" placeholder="Dec 31, 2025" />
                <div style={{ gridColumn: "1/-1" }}><Input label="Description" k="desc" placeholder="What is this coupon for?" /></div>

                <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: "12px" }}>
                  <button type="button" onClick={() => upd("active", !form.active)} style={{ width: 44, height: 24, borderRadius: 12, background: form.active ? "var(--clr-primary)" : "var(--clr-bg-3)", border: `1px solid ${form.active ? "var(--clr-primary)" : "var(--clr-border-2)"}`, position: "relative", cursor: "pointer", transition: "all 0.3s" }}>
                    <span style={{ position: "absolute", top: 2, left: form.active ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", display: "block" }} />
                  </button>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>Active — coupon is usable by customers</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button onClick={handleSave} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {editId ? "Save Changes" : "Create Coupon"}
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