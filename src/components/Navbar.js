import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function AppNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        setIsLoggedIn(!!token);
        setRole(userRole || "");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole("");
        navigate("/");
    };

    const handleReportIncident = () => {
        if (isLoggedIn) {
            navigate("/report-incident");
        } else {
            navigate("/register");
        }
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand">
                    🌍 Disaster Management
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-link">
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/incidents"
                            className="nav-link"
                        >
                            Incidents
                        </Nav.Link>
                        <Nav.Link as={Link} to="/stats" className="nav-link">
                            Charts
                        </Nav.Link>
                        <Nav.Link as={Link} to="/donation" className="nav-link">
                            Donate
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/volunteer"
                            className="nav-link"
                        >
                            Volunteer
                        </Nav.Link>

                        {isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/report"
                                className="nav-link"
                            >
                                Report Incident
                            </Nav.Link>
                        )}

                        {role !== "Admin" && isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/subscriptions"
                                className="nav-link"
                            >
                                Subscriptions
                            </Nav.Link>
                        )}

                        {role === "Admin" && isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/admin"
                                className="nav-link"
                            >
                                Admin Panel
                            </Nav.Link>
                        )}

                        {isLoggedIn ? (
                            <Button
                                variant="danger"
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    className="nav-link"
                                >
                                    Login
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/register"
                                    className="nav-link"
                                >
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
