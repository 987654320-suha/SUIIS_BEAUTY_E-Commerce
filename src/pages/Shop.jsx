import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ALL_PRODUCTS, CATEGORIES, SORT_OPTIONS } from "../data/products";
import { useCart, useWishlist } from "../context/CartContext";

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹3,500", min: 2000, max: 3500 },
  { label: "Above ₹3,500", min: 3500, max: Infinity },
];

const PAGE_SIZE = 12;

function FilterSidebar({ activeCategory, setActiveCategory, priceRange, setPriceRange, filters, setFilters, onClear }) {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "28px" }}>
      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--clr-text-3)", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid var(--clr-divider)" }}>{title}</h3>
      {children}
    </div>
  );

  const RadioItem = ({ label, active, onClick, count }) => (
    <button onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "9px 12px", background: active ? "rgba(201,169,110,0.08)" : "transparent", border: "none", borderLeft: `2px solid ${active ? "var(--clr-primary)" : "transparent"}`, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: active ? "var(--clr-primary)" : "var(--clr-text-2)", fontWeight: active ? 500 : 300 }}>{label}</span>
      {count !== undefined && <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--clr-text-muted)", background: "var(--clr-bg-3)", padding: "1px 6px" }}>{count}</span>}
    </button>
  );

  const CheckItem = ({ label, checked, onChange }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", cursor: "pointer" }}>
      <span style={{ width: 14, height: 14, border: `2px solid ${checked ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: checked ? "var(--clr-primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
        {checked && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--clr-bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
      </span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: checked ? "var(--clr-primary)" : "var(--clr-text-3)", fontWeight: checked ? 400 : 300, transition: "color 0.2s" }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
    </label>
  );

  return (
    <aside style={{ width: 230, flexShrink: 0, position: "sticky", top: 92, maxHeight: "calc(100vh - 120px)", overflowY: "auto", paddingRight: "4px" }}>
      <Section title="Category">
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {CATEGORIES.map(cat => <RadioItem key={cat.id} label={cat.name} count={cat.count} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)} />)}
        </div>
      </Section>

      <Section title="Price Range">
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {PRICE_RANGES.map(r => <RadioItem key={r.label} label={r.label} active={priceRange.label === r.label} onClick={() => setPriceRange(r)} />)}
        </div>
      </Section>

      <Section title="Filter By">
        <CheckItem label="Bestsellers Only" checked={filters.bestseller} onChange={e => setFilters(p => ({ ...p, bestseller: e.target.checked }))} />
        <CheckItem label="New Arrivals" checked={filters.isNew} onChange={e => setFilters(p => ({ ...p, isNew: e.target.checked }))} />
        <CheckItem label="On Sale" checked={filters.sale} onChange={e => setFilters(p => ({ ...p, sale: e.target.checked }))} />
        <CheckItem label="In Stock" checked={filters.inStock} onChange={e => setFilters(p => ({ ...p, inStock: e.target.checked }))} />
      </Section>

      <Section title="Min Rating">
        {[4.5, 4.0, 3.5, 0].map(r => (
          <RadioItem key={r} label={r === 0 ? "All Ratings" : `${r}★ & Above`} active={filters.minRating === r} onClick={() => setFilters(p => ({ ...p, minRating: r }))} />
        ))}
      </Section>

      <button onClick={onClear} style={{ width: "100%", padding: "10px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#e87070"; e.currentTarget.style.color = "#e87070"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-3)"; }}>
        Clear All Filters
      </button>
    </aside>
  );
}

export default function Shop() {
  const { category: urlCat } = useParams();
  const [searchParams] = useSearchParams();
  const qFilter = searchParams.get("filter");
  const qSearch = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(urlCat || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [filters, setFilters] = useState({ bestseller: qFilter === "bestseller", isNew: qFilter === "new", sale: false, inStock: false, minRating: 0 });
  const [searchQ, setSearchQ] = useState(qSearch);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  
  useEffect(() => {
  setFilters(prev => ({
    ...prev,
    bestseller: qFilter === "bestseller",
    isNew: qFilter === "new"
  }));
}, [qFilter]);

  useEffect(() => { if (urlCat) setActiveCategory(urlCat); }, [urlCat]);
  useEffect(() => { setPage(1); }, [activeCategory, sortBy, priceRange, filters, searchQ]);

  const clearAll = () => {
    setFilters({ bestseller: false, isNew: false, sale: false, inStock: false, minRating: 0 });
    setPriceRange(PRICE_RANGES[0]);
    setSearchQ("");
    setActiveCategory("all");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.tags || []).some(t => t.includes(q)));
    }
    list = list.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (filters.bestseller) list = list.filter(p => p.isBestseller);
    if (filters.isNew) list = list.filter(p => p.isNew);
    if (filters.sale) list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (filters.inStock) list = list.filter(p => p.stock > 0);
    if (filters.minRating > 0) list = list.filter(p => p.rating >= filters.minRating);
    switch (sortBy) {
      case "newest": list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "bestseller": list.sort((a, b) => b.reviews - a.reviews); break;
      default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [activeCategory, sortBy, priceRange, filters, searchQ]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters = filters.bestseller || filters.isNew || filters.sale || filters.inStock || filters.minRating > 0 || priceRange.min > 0 || searchQ;

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", letterSpacing: "0.06em" }}>
            <Link to="/" style={{ color: "var(--clr-text-3)", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "var(--clr-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--clr-text-3)"}>Home</Link>
            <span>/</span><span style={{ color: "var(--clr-text-2)" }}>Shop</span>
            {activeCategory !== "all" && <><span>/</span><span style={{ color: "var(--clr-primary)" }}>{activeCategory}</span></>}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 300, color: "var(--clr-text)", lineHeight: 1, marginBottom: "8px" }}>
                {activeCategory === "all" ? "All Products" : activeCategory}
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-3)", fontWeight: 300 }}>
                {filtered.length} products {searchQ && `for "${searchQ}"`}
              </p>
            </div>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", padding: "0 14px", gap: "8px", transition: "border-color 0.3s" }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "var(--clr-primary)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "var(--clr-border-2)"}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..." style={{ background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text)", padding: "12px 0", width: "200px" }} />
              {searchQ && <button onClick={() => setSearchQ("")} style={{ color: "var(--clr-text-3)", fontSize: "18px", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>}
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: "6px 16px", border: `1px solid ${activeCategory === cat.id ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: activeCategory === cat.id ? "var(--clr-primary)" : "transparent", color: activeCategory === cat.id ? "var(--clr-bg)" : "var(--clr-text-3)", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s" }}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ borderBottom: "1px solid var(--clr-divider)", background: "var(--clr-bg-2)", padding: "0 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setSidebarOpen(s => !s)} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", border: "1px solid var(--clr-border-2)", background: "transparent", color: "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.color = "var(--clr-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border-2)"; e.currentTarget.style.color = "var(--clr-text-2)"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>
              {sidebarOpen ? "Hide" : "Show"} Filters
            </button>
            {hasActiveFilters && (
              <button onClick={clearAll} style={{ padding: "5px 12px", border: "1px solid rgba(232,160,180,0.3)", background: "rgba(232,160,180,0.08)", color: "var(--clr-accent)", fontFamily: "var(--font-body)", fontSize: "11px", cursor: "pointer" }}>
                Clear All ×
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* View Toggle */}
            <div style={{ display: "flex", border: "1px solid var(--clr-border-2)" }}>
              {[{ m: "grid", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> }, { m: "list", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg> }].map(v => (
                <button key={v.m} onClick={() => setViewMode(v.m)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: viewMode === v.m ? "var(--clr-primary)" : "transparent", color: viewMode === v.m ? "var(--clr-bg)" : "var(--clr-text-3)", border: "none", cursor: "pointer", transition: "all 0.2s" }}>{v.icon}</button>
              ))}
            </div>
            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--clr-text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sort:</span>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={{ background: "var(--clr-bg-3)", border: "1px solid var(--clr-border-2)", color: "var(--clr-text)", fontFamily: "var(--font-body)", fontSize: "12px", padding: "6px 12px", outline: "none", cursor: "pointer" }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "36px 40px 80px" }}>
        <div style={{ display: "flex", gap: "36px", alignItems: "flex-start" }}>
          {sidebarOpen && <FilterSidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} priceRange={priceRange} setPriceRange={setPriceRange} filters={filters} setFilters={setFilters} onClear={clearAll} />}

          <div style={{ flex: 1, minWidth: 0 }}>
            {paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px", opacity: 0.2 }}>🔍</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 300, color: "var(--clr-text-2)", marginBottom: "10px" }}>No products found</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--clr-text-3)", marginBottom: "24px" }}>Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} style={{ padding: "12px 28px", background: "var(--clr-primary)", color: "var(--clr-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Reset Filters</button>
              </div>
            ) : viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${sidebarOpen ? 3 : 4}, 1fr)`, gap: "16px" }}>
                {paginated.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {paginated.map(p => <ListCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "56px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "9px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: page === 1 ? "var(--clr-text-muted)" : "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "12px", cursor: page === 1 ? "default" : "pointer", transition: "all 0.2s" }}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} style={{ width: 36, height: 36, border: `1px solid ${page === n ? "var(--clr-primary)" : "var(--clr-border-2)"}`, background: page === n ? "var(--clr-primary)" : "transparent", color: page === n ? "var(--clr-bg)" : "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "9px 18px", border: "1px solid var(--clr-border-2)", background: "transparent", color: page === totalPages ? "var(--clr-text-muted)" : "var(--clr-text-2)", fontFamily: "var(--font-body)", fontSize: "12px", cursor: page === totalPages ? "default" : "pointer", transition: "all 0.2s" }}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const [hov, setHov] = useState(false);
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", gap: "20px", padding: "20px", background: "var(--clr-bg-card)", border: `1px solid ${hov ? "var(--clr-border)" : "var(--clr-border-2)"}`, transition: "all 0.3s", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "var(--shadow-sm)" : "none" }}>
        <img src={product.image} alt={product.name} style={{ width: 110, height: 110, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clr-primary)", display: "block", marginBottom: "4px" }}>{product.category}</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, color: "var(--clr-text)", marginBottom: "6px" }}>{product.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--clr-text-3)", fontWeight: 300, lineHeight: 1.6, maxWidth: "500px" }}>{product.description?.slice(0, 110)}...</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, color: "var(--clr-primary)" }}>₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--clr-text-muted)", textDecoration: "line-through" }}>₹{product.originalPrice.toLocaleString("en-IN")}</span>}
              {disc > 0 && <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, color: "#7ec88a", background: "rgba(126,200,138,0.1)", padding: "2px 7px" }}>−{disc}%</span>}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={e => { e.preventDefault(); toggleWishlist(product); }} style={{ width: 36, height: 36, border: "1px solid var(--clr-border-2)", background: "var(--clr-bg-3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(product._id) ? "var(--clr-accent)" : "none"} stroke={isWishlisted(product._id) ? "var(--clr-accent)" : "var(--clr-text-2)"} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
              <button onClick={e => { e.preventDefault(); addToCart(product); }} style={{ padding: "0 18px", height: 36, background: "var(--clr-primary)", border: "none", color: "var(--clr-bg)", fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s" }}>
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}