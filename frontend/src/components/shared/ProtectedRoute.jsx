import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useGetMeQuery } from "@/features/auth/authApi";
import LoadingSpinner from "./LoadingSpinner";
import { ROUTES } from "@/utils/constants";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Only verify session with the server when there's no local auth state
  // (i.e. first-ever visit or after localStorage was cleared)
  const hasToken = !!localStorage.getItem("access_token");
  const { isLoading } = useGetMeQuery(undefined, { skip: isAuthenticated || !hasToken });

  // Show spinner only when actively verifying session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
