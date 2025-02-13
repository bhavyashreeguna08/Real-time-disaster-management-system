import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import "../styles/incidentlist.css";

function IncidentList() {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7259/api/incidents/all",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                setIncidents(response.data);
            } catch (error) {
                console.error("Error fetching incidents", error);
            }
        };

        fetchIncidents();
    }, []);

    return (
        <Container>
            <h3 className="incident-heading">🚨 Reported Incidents</h3>
            <Row>
                {incidents.map((incident) => (
                    <Col md={6} lg={4} key={incident.id}>
                        <Card className="incident-card">
                            {incident.imageUrl && (
                                <Card.Img
                                    variant="top"
                                    src={`https://localhost:7259/${incident.imageUrl}`}
                                    alt="Incident"
                                    className="incident-image"
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{incident.title}</Card.Title>
                                <Card.Text className="incident-description">
                                    {incident.description}
                                </Card.Text>
                                <Badge bg="danger" className="incident-region">
                                    🌍 {incident.region}
                                </Badge>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default IncidentList;
