import React, { useState } from "react";
import { AdminSidebar } from "./AdminDashboard";
import { useToast } from "../../context/ToastContext";

const MOCK_USERS = [
  { id: "u001", name: "Priya Sharma", email: "priya@email.com", phone: "9876543210", role: "customer", status: "active", joined: "Jan 15, 2024", orders: 8, spent: 18420, tier: "Gold", city: "Mumbai" },
  { id: "u002", name: "Ananya Mehta", email: "ananya@email.com", phone: "9812345678", role: "customer", status: "active", joined: "Feb 3, 2024", orders: 5, spent: 9850, tier: "Silver", city: "Bangalore" },
  { id: "u003", name: "Rahul Verma", email: "rahul@email.com", phone: "9834567890", role: "seller", status: "active", joined: "Mar 1, 2024", orders: 0, spent: 0, tier: "—", city: "Delhi" },
  { id: "u004", name: "Divya Rathi", email: "divya@email.com", phone: "9856789012", role: "customer", status: "active", joined: "Jan 28, 2024", orders: 12, spent: 34500, tier: "Platinum", city: "Jaipur" },
  { id: "u005", name: "Admin User", email: "admin@suiis.com", phone: "9800000001", role: "admin", status: "active", joined: "Jan 1, 2024", orders: 0, spent: 0, tier: "—", city: "Mumbai" },
  { id: "u006", name: "Komal Shah", email: "komal@email.com", phone: "9878901234", role: "customer", status: "inactive", joined: "Apr 10, 2024", orders: 2, spent: 2100, tier: "Silver", city: "Ahmedabad" },
  { id: "u007", name: "Meera Joshi", email: "meera@email.com", phone: "9890123456", role: "customer", status: "active", joined: "Mar 22, 2024", orders: 18, spent: 56200, tier: "Gold", city: "Pune" },
  { id: "u008", name: "Sneha Nair", email: "sneha@email.com", phone: "9901234567", role: "customer", status: "active", joined: "Feb 14, 2024", orders: 6, spent: 14300, tier: "Gold", city: "Chennai" },
  { id: "u009", name: "Pooja Verma", email: "pooja@email.com", phone: "9923456789", role: "customer", status: "blocked", joined: "May 5, 2024", orders: 1, spent: 699, tier: "Silver", city: "Kolkata" },
  { id: "u010", name: "Lakshmi Rao", email: "lakshmi@email.com", phone: "9945678901", role: "customer", status: "active", joined: "Jan 20, 2024", orders: 9, spent: 21800, tier: "Gold", city: "Hyderabad" },
];

const ROLE_COLORS = { admin: { bg: "rgba(201,169,110,0.12)", text: "#c9a96e", border: "rgba(201,169,110,0.3)" }, seller: { bg: "rgba(184,212,216,0.12)", text: "#b8d4d8", border: "rgba(184,212,216,0.3)" }, customer: { bg: "rgba(255,255,255,0.05)", text: "var(--clr-text-3)", border: "var(--clr-border-2)" } };
const STATUS_COLORS = { active: "#7ec88a", inactive: "#c9a96e", blocked: "#e87070" };
const TIER_COLORS = { Gold: "#FFD700", Platinum: "#E5E4E2", Silver: "#C0C0C0", Diamond: "#B9F2FF", "—": "var(--clr-text-muted)" };

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const updateUserStatus = (id, status) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    toast.success(`User status updated to "${status}"`);
    setSelectedUser(null);
  };

  const updateUserRole = (id, role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    toast.success(`User role updated to "${role}"`);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--clr-bg)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text)" }}>Users</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", marginTop: "2px" }}>{filtered.length} of {users.length} users</p>
          </div>
          <button onClick={() => toast.info("Exporting users...")} style={{ padding: "10px 20px", background: "var(--clr-bg-3)", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}>📤 Export</button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total Users", value: users.length, color: "var(--clr-text-2)" },
              { label: "Active", value: users.filter(u => u.status === "active").length, color: "#7ec88a" },
              { label: "Sellers", value: users.filter(u => u.role === "seller").length, color: "#b8d4d8" },
              { label: "Blocked", value: users.filter(u => u.status === "blocked").length, color: "#e87070" },
            ].map(s => (
              <div key={s.label} style={{ padding: "16px 18px", background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: s.color, marginBottom: "2px" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", flex: "1 1 220px" }} onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"} onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)" }} />
            </div>
            {[["all", "All Roles", ["all", "customer", "seller", "admin"]], ["all", "All Statuses", ["all", "active", "inactive", "blocked"]]].map(([val, label, opts], idx) => (
              <select key={idx} value={idx === 0 ? roleFilter : statusFilter} onChange={e => idx === 0 ? setRoleFilter(e.target.value) : setStatusFilter(e.target.value)} style={{ padding: "10px 16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none", cursor: "pointer", minWidth: "150px" }}>
                {opts.map(o => <option key={o} value={o}>{o === "all" ? label : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border-2)", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ background: "var(--clr-bg-3)" }}>
                  {["User", "Contact", "Role", "Status", "Tier", "Orders", "Total Spent", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", padding: "14px 16px", textAlign: "left", borderBottom: "1px solid var(--clr-divider)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const rc = ROLE_COLORS[user.role];
                  return (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--clr-divider)", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--clr-bg-3)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--clr-primary)", fontWeight: 500, flexShrink: 0 }}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--clr-text)" }}>{user.name}</div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)" }}>{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-2)" }}>{user.email}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)" }}>{user.phone}</div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: rc.text, background: rc.bg, border: `1px solid ${rc.border}`, padding: "3px 9px" }}>{user.role}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[user.status], display: "block", flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: STATUS_COLORS[user.status], fontWeight: 500 }}>{user.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: TIER_COLORS[user.tier] || "var(--clr-text-3)", fontWeight: 500 }}>{user.tier}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-2)" }}>{user.orders}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--clr-primary)" }}>
                          {user.spent > 0 ? `₹${user.spent.toLocaleString("en-IN")}` : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{user.joined}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => setSelectedUser(user)} style={{ padding: "5px 12px", border: "1px solid var(--clr-primary)", background: "transparent", color: "var(--clr-primary)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-bg)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--clr-primary)"; }}>
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Modal */}
        {selectedUser && (
          <div onClick={() => setSelectedUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--clr-bg-2)", border: "1px solid var(--clr-border)", width: "min(500px,100%)", padding: "36px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "20px" }}>Manage User</h3>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", marginBottom: "24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid var(--clr-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--clr-primary)", flexShrink: 0 }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--clr-text)" }}>{selectedUser.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)" }}>{selectedUser.email} · {selectedUser.city}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-primary)", marginTop: "2px" }}>{selectedUser.orders} orders · ₹{selectedUser.spent.toLocaleString("en-IN")} spent</div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "10px" }}>Account Status</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["active", "inactive", "blocked"].map(s => (
                    <button key={s} onClick={() => updateUserStatus(selectedUser.id, s)} style={{ flex: 1, padding: "10px", border: `1px solid ${selectedUser.status === s ? STATUS_COLORS[s] : "var(--clr-border-2)"}`, background: selectedUser.status === s ? `${STATUS_COLORS[s]}15` : "transparent", color: selectedUser.status === s ? STATUS_COLORS[s] : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: selectedUser.status === s ? 600 : 300, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--clr-text-3)", display: "block", marginBottom: "10px" }}>Role</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["customer", "seller", "admin"].map(r => (
                    <button key={r} onClick={() => updateUserRole(selectedUser.id, r)} style={{ flex: 1, padding: "10px", border: `1px solid ${selectedUser.role === r ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: selectedUser.role === r ? "rgba(201,169,110,0.1)" : "transparent", color: selectedUser.role === r ? "var(--clr-primary)" : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: selectedUser.role === r ? 600 : 300, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { toast.info(`Email sent to ${selectedUser.email}`); }} style={{ flex: 1, padding: "12px", background: "var(--clr-bg-3)", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}>📧 Email User</button>
                <button onClick={() => setSelectedUser(null)} style={{ padding: "12px 20px", background: "transparent", color: "var(--clr-text-2)", border: "1px solid var(--clr-border-2)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px" }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}