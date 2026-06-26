import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ========== RECENTLY VIEWED ==========
const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { const v = localStorage.getItem("suiis_rv"); return v ? JSON.parse(v) : []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("suiis_rv", JSON.stringify(recentlyViewed)); } catch {}
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p._id !== product._id);
      return [product, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

// ========== REWARDS ==========
const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
  const [points, setPoints] = useState(2480);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "earned", points: 500, desc: "Order SUIIS12345678", date: "Apr 28" },
    { id: 2, type: "earned", points: 300, desc: "Referral Bonus - Ananya", date: "Apr 20" },
    { id: 3, type: "earned", points: 1000, desc: "Welcome Bonus", date: "Jan 1" },
    { id: 4, type: "redeemed", points: -200, desc: "Redeemed on Order SUIIS9911", date: "Mar 15" },
    { id: 5, type: "earned", points: 880, desc: "Order SUIIS8877665", date: "Feb 10" },
  ]);
  const [tier, setTier] = useState("Gold");

  const TIERS = [
    { name: "Silver", min: 0, max: 999, color: "#C0C0C0", perks: ["5% discount", "Birthday gift"] },
    { name: "Gold", min: 1000, max: 4999, color: "#FFD700", perks: ["10% discount", "Early access", "Free shipping", "Birthday gift"] },
    { name: "Platinum", min: 5000, max: 9999, color: "#E5E4E2", perks: ["15% discount", "Priority support", "Free returns", "Exclusive products"] },
    { name: "Diamond", min: 10000, max: Infinity, color: "#B9F2FF", perks: ["20% discount", "Personal stylist", "VIP access", "Free gifting"] },
  ];

  const earnPoints = useCallback((amount, desc) => {
    const earned = Math.floor(amount / 10);
    setPoints(p => p + earned);
    setTransactions(prev => [{ id: Date.now(), type: "earned", points: earned, desc, date: "Today" }, ...prev]);
  }, []);

  const redeemPoints = useCallback((pts) => {
    if (pts > points) return false;
    setPoints(p => p - pts);
    setTransactions(prev => [{ id: Date.now(), type: "redeemed", points: -pts, desc: "Redeemed for discount", date: "Today" }, ...prev]);
    return true;
  }, [points]);

  const currentTier = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  return (
    <RewardsContext.Provider value={{ points, transactions, currentTier, nextTier, progressToNext, TIERS, earnPoints, redeemPoints }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => useContext(RewardsContext);