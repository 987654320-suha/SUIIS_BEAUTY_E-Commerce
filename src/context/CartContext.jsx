import { useAuth } from "./AuthContext";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export const CartContext = createContext();
export const WishlistContext = createContext();


const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

const cartKey = user
  ? `suiis_cart_${user._id || user.email}`
  : "suiis_cart_guest";

const savedKey = user
  ? `suiis_saved_${user._id || user.email}`
  : "suiis_saved_guest";

const [cart, setCart] = useState([]);
const [savedForLater, setSavedForLater] = useState([]);

useEffect(() => {
  save(cartKey, cart);
}, [cart, cartKey]);

useEffect(() => {
  save(savedKey, savedForLater);
}, [savedForLater, savedKey]);
  useEffect(() => {
  setCart(load(cartKey, []));
  setSavedForLater(load(savedKey, []));
}, [cartKey, savedKey]);
  const addToCart = useCallback((product, qty = 1, shade = null) => {
    setCart(prev => {
      const key = shade ? `${product._id}_${shade}` : product._id;
      const existing = prev.find(i => i.cartKey === key);
      if (existing) return prev.map(i => i.cartKey === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty, shade, cartKey: key }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey && i._id !== cartKey));
  }, []);

  const updateQty = useCallback((cartKey, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.cartKey !== cartKey && i._id !== cartKey)); return; }
    setCart(prev => prev.map(i => (i.cartKey === cartKey || i._id === cartKey) ? { ...i, qty } : i));
  }, []);

  const saveForLater = useCallback((cartKey) => {
    setCart(prev => {
      const item = prev.find(i => i.cartKey === cartKey || i._id === cartKey);
      if (item) setSavedForLater(s => [...s.filter(x => x.cartKey !== cartKey), item]);
      return prev.filter(i => i.cartKey !== cartKey && i._id !== cartKey);
    });
  }, []);

  const moveToCart = useCallback((cartKey) => {
    setSavedForLater(prev => {
      const item = prev.find(i => i.cartKey === cartKey || i._id === cartKey);
      if (item) setCart(c => [...c, item]);
      return prev.filter(i => i.cartKey !== cartKey && i._id !== cartKey);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartSavings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      saveForLater, moveToCart, savedForLater,
      cartCount, cartTotal, cartSavings,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const WishlistProvider = ({ children }) => {

  const { user } = useAuth();

  const wishlistKey = user
    ? `suiis_wishlist_${user._id || user.email}`
    : "suiis_wishlist_guest";

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(load(wishlistKey, []));
  }, [wishlistKey]);

  useEffect(() => {
    save(wishlistKey, wishlist);
  }, [wishlist, wishlistKey]);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === product._id);

      return exists
        ? prev.filter(i => i._id !== product._id)
        : [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.some(i => i._id === id),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export const useWishlist = () => useContext(WishlistContext);