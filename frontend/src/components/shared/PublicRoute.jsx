import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useGetMeQuery } from "@/features/auth/authApi";
import LoadingSpinner from "./LoadingSpinner";
import { ROUTES } from "@/utils/constants";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Only check session when we have a token but no user state yet
  const hasToken = !!localStorage.getItem("access_token");
  const { isLoading } = useGetMeQuery(undefined, { skip: isAuthenticated || !hasToken });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default PublicRoute;
