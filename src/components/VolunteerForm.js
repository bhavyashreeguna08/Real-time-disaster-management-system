import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import axios from "axios";
import "../styles/volunteerform.css"; // Import CSS for styling

function VolunteerForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [region, setRegion] = useState("");
    const [skills, setSkills] = useState("");
    const [availability, setAvailability] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "danger"

    const handleSubmit = async (e) => {
        e.preventDefault();

        const volunteerData = {
            name,
            email,
            phone,
            region,
            skills,
            availability,
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/volunteers",
                volunteerData
            );
            setStatusMessage(
                "🎉 Registration successful! Thank you for volunteering."
            );
            setMessageType("success");

            // Clear input fields after successful submission
            setName("");
            setEmail("");
            setPhone("");
            setRegion("");
            setSkills("");
            setAvailability("");
        } catch (error) {
            setStatusMessage("❌ Registration failed. Please try again.");
            setMessageType("danger");
        }
    };

    return (
        <Container className="volunteer-container">
            <Card className="shadow-lg volunteer-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Volunteer Registration</h2>
                    {statusMessage && (
                        <Alert variant={messageType} className="text-center">
                            {statusMessage}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formRegion" className="mb-3">
                            <Form.Label>Region</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSkills" className="mb-3">
                            <Form.Label>Skills</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your skills"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            controlId="formAvailability"
                            className="mb-4"
                        >
                            <Form.Label>Availability</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your availability"
                                value={availability}
                                onChange={(e) =>
                                    setAvailability(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="volunteer-btn w-100"
                        >
                            Register as Volunteer
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default VolunteerForm;
