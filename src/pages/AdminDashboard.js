import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "../styles/admindashboard.css"; // Import CSS file for styling

const AdminDashboard = () => {
    return (
        <Container className="admin-dashboard">
            <h2 className="text-center mb-4">Admin Dashboard</h2>

            <Row className="justify-content-center">
                {/* User List */}
                <Col md={5}>
                    <Card className="admin-card shadow-lg">
                        <Card.Body className="text-center">
                            <Card.Title>User Management</Card.Title>
                            <Card.Text>
                                View and manage registered users.
                            </Card.Text>
                            <Link to="/admin/users">
                                <Button
                                    variant="primary"
                                    className="dashboard-btn"
                                >
                                    User List
                                </Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Send Notifications */}
                <Col md={5}>
                    <Card className="admin-card shadow-lg">
                        <Card.Body className="text-center">
                            <Card.Title>Send Notifications</Card.Title>
                            <Card.Text>
                                Send alerts and updates to users.
                            </Card.Text>
                            <Link to="/admin/notifications">
                                <Button
                                    variant="primary"
                                    className="dashboard-btn"
                                >
                                    Send Notification
                                </Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
