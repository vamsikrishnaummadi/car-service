import express from "express";
import { verifyToken,verifyCustomer,verifyMerchant } from "../middlewares/auth.js";
import {createBooking, getBookings, getBookingById, updateBooking, deleteBooking, getBookingsByServiceId} from "../controllers/booking.controller.js";

const router = express.Router();

// create a new Booking
router.post('/create', verifyToken, verifyCustomer, createBooking);

// get all Bookings
router.get('/', getBookings);

// get Booking By its ID
router.get("/:id", getBookingById);

// Get all Bookings by Service ID
router.get("/service/:serviceId", getBookingsByServiceId);

// update Booking by its ID
router.put('/:id', verifyToken, updateBooking);

// delete Booking By its ID
router.delete('/:id', verifyToken, deleteBooking);

export default router;
