import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem("role");

    // If the user is not an admin, redirect them to the homepage
    return role === "Admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
