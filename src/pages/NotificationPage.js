import React, { useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/sendnotification.css"; // Import CSS file

const SendNotification = () => {
    const [region, setRegion] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendNotification = async () => {
        if (!region || !title || !description) {
            toast.warning("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("https://localhost:7282/api/notifications/send", {
                region,
                title,
                description,
            });
            toast.success("Notification sent successfully!");
            setRegion("");
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Failed to send notification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notification-container">
            <motion.div
                className="notification-card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="notification-title">
                    <FaBell />
                    Send Notification
                </h1>

                <div>
                    <input
                        type="text"
                        placeholder="Enter Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="notification-input"
                        required
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Incident Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="notification-input"
                        required
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Incident Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="notification-textarea"
                        rows="4"
                        required
                    />
                </div>

                <motion.button
                    onClick={handleSendNotification}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="notification-button"
                >
                    {loading ? "Sending..." : "Send Notification"}
                </motion.button>

                <p className="notification-footer">
                    &copy; 2025 Disaster Management, Inc. All Rights Reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default SendNotification;
