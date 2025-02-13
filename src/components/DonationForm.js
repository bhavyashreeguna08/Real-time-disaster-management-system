import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import axios from "axios";
import "../styles/donationform.css"; // Import CSS for additional styling

function DonationForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [disasterId, setDisasterId] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "danger"

    const handleSubmit = async (e) => {
        e.preventDefault();

        const donationData = { name, email, phone, amount, disasterId };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/donations",
                donationData
            );
            setStatusMessage(
                "🎉 Donation successful! Thank you for your support."
            );
            setMessageType("success");
            setName("");
            setEmail("");
            setPhone("");
            setAmount("");
            setDisasterId("");
        } catch (error) {
            setStatusMessage(
                "❌ There was an error processing your donation. Please try again."
            );
            setMessageType("danger");
        }
    };

    return (
        <Container className="donation-container">
            <Card className="shadow-lg donation-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Make a Donation</h2>
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

                        <Form.Group controlId="formAmount" className="mb-3">
                            <Form.Label>Donation Amount ($)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter donation amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDisasterId" className="mb-4">
                            <Form.Label>Disaster</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter disaster name"
                                value={disasterId}
                                onChange={(e) => setDisasterId(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="donate-btn w-100"
                        >
                            Donate Now
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default DonationForm;
