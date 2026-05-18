import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./loader/loader";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader/>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
