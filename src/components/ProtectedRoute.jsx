import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }){

  const { user } = useAuth();

  if(!user){
    return <Navigate to="/login" />;
  }

  return children;
}

<Route path="/cart" element={
  <ProtectedRoute>
    <Cart />
  </ProtectedRoute>
} />