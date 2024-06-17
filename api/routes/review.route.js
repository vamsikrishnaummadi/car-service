import express from 'express';
import {
    createReview,
    getReviews,
    getReviewById,
    getReviewsByBookingId,
    updateReview,
    deleteReview
} from '../controllers/review.controller.js';
import { verifyToken, verifyCustomer } from '../middlewares/auth.js';

const router = express.Router();


router.post('/create', verifyToken, verifyCustomer, createReview);

// Get all reviews
router.get('/', getReviews);

// Get all reviews by booking ID
router.get("/booking/:bookingId", getReviewsByBookingId);

// Get a review by ID
router.get('/:id',getReviewById);

// Update a review by ID
router.put('/:id', verifyToken, verifyCustomer, updateReview);

// Delete a review by ID
router.delete('/:id', verifyToken, verifyCustomer, deleteReview);

export default router;
