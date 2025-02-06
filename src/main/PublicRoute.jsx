import React from "react";
import { Navigate } from "react-router";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
