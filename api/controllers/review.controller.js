import Review from '../models/review.model.js';
import errorHandler from '../utils/errorHandler.js';

// Create a new review
export const createReview = async (req, res, next) => {
    const { booking_id, rating, comment } = req.body;
    const customer_id = req.user.id; // Assuming user ID is set in req.user by verifyCustomer middleware

    try {
        const newReview = new Review({
            customer_id,
            booking_id,
            rating,
            comment
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        next(err);
    }
};

// Get all reviews
export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate('customer_id', 'username email')
            .populate({
                path: 'booking_id',
                populate: {
                    path: 'service_id', // Assuming the Booking schema references the Service
                    select: 'service_name description price'
                }
            });
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};

// Get reviews by Booking Id 
export const getReviewsByBookingId = async (req, res, next) => {
    const {bookingId} = req.params;
    const {page = 1, limit=25} = req.query;
    try {
        const reviews = await Review.find({ booking_id: bookingId })
            .populate('customer_id', 'username email')
            .populate({
                path: 'booking_id',
                populate: {
                    path: 'service_id', // Assuming the Booking schema references the Service
                    select: 'service_name description price'
                }
            })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};


// Get a review by ID
export const getReviewById = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('customer_id', 'username email')
            .populate({
                path : 'booking_id',
                populate : {
                    path: "service_id", 
                    select : 'service_name description price'
                }
            });

        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }

        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
};

// Update a review by ID
export const updateReview = async (req, res, next) => {
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }

        // Ensure the review belongs to the logged-in customer
        if (review.customer_id.toString() !== req.user.id) {
            return next(errorHandler(403, 'You can only update your own reviews'));
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.updated_at = Date.now();

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (err) {
        next(err);
    }
};

// Delete a review by ID
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return next(errorHandler(404, 'Review not found'));
        }

        // Ensure the review belongs to the logged-in customer
        if (review.customer_id.toString() !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own reviews'));
        }

        await review.deleteOne();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
};
