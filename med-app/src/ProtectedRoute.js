import React from "react";
import { Navigate, Route } from "react-router-dom";

// Dummy function to check user permissions
const checkPermission = (token, requiredRole, userRole) => {
  return token !== "";
};

const ProtectedRoute = ({ route }) => {
  const token = localStorage.getItem("token"); // Get the user's role from local storage
  const userRole = localStorage.getItem("userRole");

  return checkPermission(token, route.requiredRole, userRole) ? (
    <Route
      exact={route.exact}
      path={route.route}
      element={route.component}
      key={route.key}
    />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
