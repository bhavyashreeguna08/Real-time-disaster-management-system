const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");

// Import Routes
const donationRoutes = require("./routes/donationRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
//const newsRoutes = require("./routes/newsRoutes");
//const geocodeRoutes = require("./routes/geocodeRoutes");
const weatherNewsRoutes = require("./routes/weatherNewsRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
//app.use("/api/news", newsRoutes);
//app.use("/api/geocode", geocodeRoutes);
app.use("/api/weather-news", weatherNewsRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
