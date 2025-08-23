import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PrivateRoute() {
  const { user, booting } = useAuth();
  if (booting) return null; // or a loader
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
