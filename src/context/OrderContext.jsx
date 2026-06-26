import React, { createContext, useContext, useState, useCallback } from "react";

const OrderContext = createContext();

const STATUS_FLOW = ["Order Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

const generateOrderId = () => "SUIIS" + Date.now().toString().slice(-8);

const MOCK_ORDERS = [
  {
    id: "SUIIS12345678", date: "April 28, 2025", status: "Delivered",
    statusIndex: 5, total: 2548, items: [
      { name: "Velvet Noir Matte Lipstick", qty: 1, price: 849, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&q=80" },
      { name: "Ethereal Glow Highlighter", qty: 1, price: 999, image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=200&q=80" },
      { name: "Precision Wing Eyeliner", qty: 1, price: 649, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80" },
    ],
    address: { name: "Priya Sharma", line1: "45 Rose Garden", city: "Mumbai", state: "Maharashtra", pincode: "400001", phone: "9876543210" },
    payment: "UPI", tracking: [
      { status: "Order Placed", time: "Apr 28, 10:00 AM", done: true },
      { status: "Confirmed", time: "Apr 28, 10:30 AM", done: true },
      { status: "Processing", time: "Apr 28, 2:00 PM", done: true },
      { status: "Shipped", time: "Apr 29, 9:00 AM", done: true },
      { status: "Out for Delivery", time: "Apr 30, 8:00 AM", done: true },
      { status: "Delivered", time: "Apr 30, 12:30 PM", done: true },
    ],
    invoice: "INV-2025-12345",
    canReturn: true, canReorder: true,
  },
  {
    id: "SUIIS87654321", date: "May 1, 2025", status: "Shipped",
    statusIndex: 3, total: 1699, items: [
      { name: "Noir Dramatique Eye Palette", qty: 1, price: 1699, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80" },
    ],
    address: { name: "Priya Sharma", line1: "45 Rose Garden", city: "Mumbai", state: "Maharashtra", pincode: "400001", phone: "9876543210" },
    payment: "Credit Card", tracking: [
      { status: "Order Placed", time: "May 1, 11:00 AM", done: true },
      { status: "Confirmed", time: "May 1, 11:30 AM", done: true },
      { status: "Processing", time: "May 1, 3:00 PM", done: true },
      { status: "Shipped", time: "May 2, 10:00 AM", done: true },
      { status: "Out for Delivery", time: null, done: false },
      { status: "Delivered", time: null, done: false },
    ],
    invoice: "INV-2025-87654",
    canReturn: false, canReorder: true,
  },
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const placeOrder = useCallback(async (cart, address, payment, couponDiscount = 0) => {
    await new Promise(r => setTimeout(r, 1200));
    const id = generateOrderId();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0) - couponDiscount;
    const newOrder = {
      id, date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
      status: "Order Placed", statusIndex: 0,
      total, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, image: i.image })),
      address, payment,
      tracking: STATUS_FLOW.map((s, idx) => ({ status: s, time: idx === 0 ? "Just now" : null, done: idx === 0 })),
      invoice: `INV-2025-${id.slice(5)}`,
      canReturn: false, canReorder: true,
    };
    setOrders(prev => [newOrder, ...prev]);
    return { success: true, orderId: id };
  }, []);

  const getOrder = useCallback((id) => orders.find(o => o.id === id), [orders]);

  const requestReturn = useCallback((orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, returnRequested: true } : o));
    return { success: true };
  }, []);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder, requestReturn }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);