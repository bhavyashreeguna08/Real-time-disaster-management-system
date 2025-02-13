import React, { useState, useEffect } from "react";
import {
    Button,
    ListGroup,
    Container,
    Alert,
    Dropdown,
    Card,
} from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/subscriptionList.css";

function SubscriptionList() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState(null);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:5001/api/subscription/list",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setSubscriptions(response.data);
            } catch (err) {
                setError("Error fetching subscriptions");
            }
        };

        const fetchCities = async () => {
            try {
                const response = await fetch("/cities.txt");
                const data = await response.text();
                const cityList = data.split("\n").map((city) => city.trim());
                setCities(cityList);
            } catch (err) {
                setError("Error fetching cities");
            }
        };

        fetchSubscriptions();
        fetchCities();
    }, []);

    const handleSubscribe = async (region) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5001/api/subscription/subscribe",
                { region },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSubscriptions([...subscriptions, region]);
        } catch (err) {
            setError("Error subscribing to region");
        }
    };

    const handleUnsubscribe = async (region) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5001/api/subscription/unsubscribe",
                { region },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSubscriptions(subscriptions.filter((sub) => sub !== region));
        } catch (err) {
            setError("Error unsubscribing from region");
        }
    };

    return (
        <div className="subscription-container">
            <motion.div
                className="subscription-card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="subscription-header">Your Subscriptions</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Subscription List */}
                <ListGroup className="subscription-list">
                    {subscriptions.length > 0 ? (
                        subscriptions.map((region, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {region}
                                <Button
                                    className="subscription-btn unsubscribe-btn"
                                    onClick={() => handleUnsubscribe(region)}
                                >
                                    Unsubscribe
                                </Button>
                            </motion.li>
                        ))
                    ) : (
                        <p>No subscriptions yet.</p>
                    )}
                </ListGroup>

                {/* Dropdown to select a city */}
                <Dropdown className="mt-3">
                    <Dropdown.Toggle className="dropdown-toggle">
                        Subscribe to a Region
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {cities.length > 0 ? (
                            cities.map((city, index) => (
                                <Dropdown.Item
                                    key={index}
                                    onClick={() => handleSubscribe(city)}
                                >
                                    {city}
                                </Dropdown.Item>
                            ))
                        ) : (
                            <Dropdown.Item disabled>
                                No cities available
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </motion.div>
        </div>
    );
}

export default SubscriptionList;
