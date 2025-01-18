import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  // Show loading while checking authentication
  if (isLoading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
