const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    amount: Number,
    disasterId: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
