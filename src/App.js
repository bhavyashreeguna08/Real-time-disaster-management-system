import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SubscriptionList from "./pages/SubscriptionList";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ReportIncident from "./components/ReportIncident";
import IncidentList from "./components/IncidentList";
import StatsChart from "./components/StatsChart";
import NotificationPage from "./pages/NotificationPage";
import UserList from "./pages/UserList"; // User List Page

// Import route guards
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import DonationPage from "./pages/DonationPage";
import VolunteerPage from "./pages/VolunteerPage";

import HomePage from "./components/HomePage";

function App() {
    return (
        <Router>
            <Navbar />
            <Container className="mt-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />{" "}
                    {/* HomePage Route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/donation" element={<DonationPage />} />
                    <Route path="/volunteer" element={<VolunteerPage />} />
                    <Route path="/incidents" element={<IncidentList />} />
                    <Route path="/stats" element={<StatsChart />} />
                    {/* Private Routes - Only logged in users can access */}
                    <Route
                        path="/subscriptions"
                        element={
                            <PrivateRoute>
                                <SubscriptionList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/report"
                        element={
                            <PrivateRoute>
                                <ReportIncident />
                            </PrivateRoute>
                        }
                    />
                    {/* Admin Routes - Only admin users can access */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/notifications"
                        element={<NotificationPage />}
                    />
                    <Route path="/admin/users" element={<UserList />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
