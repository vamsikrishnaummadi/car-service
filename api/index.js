import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import serviceRoutes from "./routes/services.route.js";
import bookingRoutes from "./routes/booking.route.js";
import reviewRoutes from "./routes/review.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());


// mongodb database connection 
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB Succefully connected");
}).catch((err) => {
    console.log(error);
});


// Running Port of API
app.listen(3000, () => {
    console.log("API Running at http://localhost:3000");
});


// Routes
app.get("/", (req,res) => {
    res.send({"API" : "Welcome to car Service Api" });
})
app.use("/api/auth", authRoutes);
app.use("/api/services",serviceRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/reviews", reviewRoutes);


// Middleware to handle Errors
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message  = error.message || "Internal Server Error."
    res.send({
        success : false,
        statusCode,
        message
    })

});