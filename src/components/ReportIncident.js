import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/reportIncident.css"; // Import custom styles

function ReportIncident() {
    const [incident, setIncident] = useState({
        title: "",
        description: "",
        region: "",
        image: null,
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncident((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        setIncident((prevState) => ({
            ...prevState,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to be logged in to report an incident.");
            return;
        }

        const formData = new FormData();
        formData.append("Title", incident.title);
        formData.append("Description", incident.description);
        formData.append("Region", incident.region);
        if (incident.image) formData.append("Image", incident.image);

        try {
            await axios.post(
                "https://localhost:7259/api/incidents/report",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage("Incident reported successfully!");
            setErrorMessage("");
            setTimeout(() => navigate("/incidents"), 2000); // Redirect after 2s
        } catch (error) {
            setErrorMessage("Error reporting incident!");
            setSuccessMessage("");
            console.error(
                "Error:",
                error.response ? error.response.data : error.message
            );
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center report-container">
            <Card className="report-card p-4 shadow-lg">
                <Card.Body>
                    <h3 className="text-center mb-4">📢 Report an Incident</h3>

                    {successMessage && (
                        <Alert variant="success" className="text-center">
                            {successMessage}
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert variant="danger" className="text-center">
                            {errorMessage}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={incident.title}
                                onChange={handleChange}
                                placeholder="Enter a short title"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={incident.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe what happened..."
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="region" className="mb-3">
                            <Form.Label>Region</Form.Label>
                            <Form.Control
                                type="text"
                                name="region"
                                value={incident.region}
                                onChange={handleChange}
                                placeholder="Enter affected region"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Upload Image (Optional)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="danger"
                            className="w-100"
                        >
                            🚨 Report Incident
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ReportIncident;
