import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider, WishlistProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { RewardsProvider } from "./context/RewardsContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <OrderProvider>
          <RecentlyViewedProvider>
            <RewardsProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </RewardsProvider>
          </RecentlyViewedProvider>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);