import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const INIT = [
  { id: "a1", name: "Priya Sharma", line1: "45, Rose Garden Society, Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400053", phone: "9876543210", type: "Home", isDefault: true },
  { id: "a2", name: "Priya Sharma", line1: "12, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034", phone: "9876543210", type: "Work", isDefault: false },
];

export default function AddressBook() {
  const [addresses, setAddresses] = useState(INIT);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "", type: "Home" });
  const { toast } = useToast();

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setEditId(null); setForm({ name: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "", type: "Home" }); setShowForm(true); };
  const openEdit = (a) => { setEditId(a.id); setForm({ ...a }); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode || !form.phone) { toast.error("Please fill all required fields"); return; }
    if (editId) {
      setAddresses(p => p.map(a => a.id === editId ? { ...a, ...form } : a));
      toast.success("Address updated!");
    } else {
      setAddresses(p => [...p, { ...form, id: "a" + Date.now(), isDefault: p.length === 0 }]);
      toast.success("Address added!");
    }
    setShowForm(false);
  };

  const handleDelete = (id) => { setAddresses(p => p.filter(a => a.id !== id)); toast.info("Address removed"); };
  const handleDefault = (id) => { setAddresses(p => p.map(a => ({ ...a, isDefault: a.id === id }))); toast.success("Default address updated"); };

  const Input = ({ label, value, onChange, placeholder, required, half }) => (
    <div style={half ? {} : {}}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>{label}{required && " *"}</label>
      <input value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--clr-primary)"}
        onBlur={e => e.target.style.borderColor = "var(--clr-border-2)"} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Home</Link><span>/</span>
            <Link to="/profile" style={{ color: "var(--clr-text-3)", textDecoration: "none" }}>Account</Link><span>/</span>
            <span style={{ color: "var(--clr-text-2)" }}>Address Book</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "var(--clr-text)" }}>Address Book</h1>
            <button onClick={openAdd} style={{ padding: "11px 22px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.25s", display: "flex", alignItems: "center", gap: "8px" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--clr-primary)"}>
              + Add New Address
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{ background: "var(--clr-bg-2)", border: `1px solid ${addr.isDefault ? "var(--clr-primary)" : "var(--clr-border-2)"}`, padding: "22px", position: "relative", transition: "border-color 0.2s" }}>
              {addr.isDefault && <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--clr-primary)", border: "1px solid rgba(201,169,110,0.3)", padding: "3px 9px", background: "rgba(201,169,110,0.08)" }}>Default</div>}
              <div style={{ display: "inline-block", marginBottom: "12px", padding: "3px 10px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, color: "var(--clr-text-3)", letterSpacing: "0.1em" }}>{addr.type}</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)", marginBottom: "6px" }}>{addr.name}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)", fontWeight: 300, lineHeight: 1.7, marginBottom: "6px" }}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginBottom: "16px" }}>📞 {addr.phone}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => openEdit(addr)} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", background: "none", border: "1px solid rgba(201,169,110,0.3)", padding: "6px 14px", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}>Edit</button>
                {!addr.isDefault && <button onClick={() => handleDefault(addr.id)} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-2)", background: "none", border: "1px solid var(--clr-border-2)", padding: "6px 14px", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}>Set Default</button>}
                {!addr.isDefault && <button onClick={() => handleDelete(addr.id)} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#e87070", background: "none", border: "1px solid rgba(232,112,112,0.3)", padding: "6px 14px", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}>Delete</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(560px, 100%)", padding: "36px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "24px" }}>{editId ? "Edit Address" : "Add New Address"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ gridColumn: "1/-1" }}><Input label="Full Name" value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Priya Sharma" required /></div>
                <div style={{ gridColumn: "1/-1" }}><Input label="Address Line 1" value={form.line1} onChange={e => upd("line1", e.target.value)} placeholder="House no., Street name" required /></div>
                <div style={{ gridColumn: "1/-1" }}><Input label="Address Line 2 (Optional)" value={form.line2 || ""} onChange={e => upd("line2", e.target.value)} placeholder="Area, Landmark" /></div>
                <Input label="City" value={form.city} onChange={e => upd("city", e.target.value)} placeholder="Mumbai" required />
                <Input label="State" value={form.state} onChange={e => upd("state", e.target.value)} placeholder="Maharashtra" required />
                <Input label="Pincode" value={form.pincode} onChange={e => upd("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="400001" required />
                <Input label="Phone" value={form.phone} onChange={e => upd("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" required />
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "6px" }}>Address Type</label>
                  <select value={form.type} onChange={e => upd("type", e.target.value)} style={{ width: "100%", padding: "11px 13px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }}>
                    {["Home", "Work", "Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button onClick={handleSave} style={{ flex: 1, padding: "13px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Save Address</button>
                <button onClick={() => setShowForm(false)} style={{ padding: "13px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}