const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    region: String,
    skills: String,
    availability: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
