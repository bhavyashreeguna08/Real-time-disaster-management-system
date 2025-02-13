const mongoose = require("mongoose");

mongoose
    .connect("mongodb://127.0.0.1:27017/donation-volunteer", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connection successful");
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });
