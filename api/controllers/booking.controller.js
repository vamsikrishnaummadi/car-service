import Booking from '../models/booking.model.js';
import Service from '../models/service.model.js';
import errorHandler from '../utils/errorHandler.js';

export const createBooking = async(req,res,next) => {
    const {service_id, date, time} = req.body;
    const customer_id = req.user.id;

    try{
        const service = await Service.findById(service_id);
        if (!service) {
            return next(errorHandler(404, 'service not found'));
        }

        const existingBooking = await Booking.findOne({
            service_id,
            customer_id,
            status: { $ne: 'Completed' }
        });

        if (existingBooking) {
            return next(errorHandler(400, 'You already have a pending or ongoing booking for this service.'));
        }

        const newBooking = new Booking({
            customer_id,
            service_id,
            merchant_id: service.merchant_id,
            date,
            time
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    }catch(err) {
        next(err);
    }
};

export const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('customer_id','username email')
            .populate('service_id', 'service_name description price')
            .populate('merchant_id', 'username email');

        res.status(200).json(bookings);
    }catch(err) {
        next(err);
    }
};

export const getBookingById = async (req, res, next) => {
   try {
      const booking = await Booking.findById(req.params.id)
        .populate('customer_id', 'username email')
        .populate('service_id', 'service_name description price')
        .populate('merchant_id', 'username email');
    
    if (!booking) {
        return next(errorHandler(404, 'Booking not found'));
    }

    res.status(200).json(booking);
   }catch(err) {
     next(err);
   }
};

export const getBookingsByServiceId = async (req, res, next) => {
    const { serviceId } = req.params;
    const { page = 1, limit = 25 } = req.query; // Default values: page 1, limit 25

    try {
        const bookings = await Booking.find({ service_id: serviceId })
            .populate('customer_id', 'username email')
            .populate('service_id', 'service_name description price')
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        // Get total count of bookings for pagination info
        const count = await Booking.countDocuments({ service_id: serviceId });

        res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            bookings
        });
    } catch (err) {
        next(err);
    }
};

export const updateBooking = async (req, res, next) => {
   const {status, date, time} = req.body;

   try {
     const booking = await Booking.findById(req.params.id);
     if (!booking) {
         return next(errorHandler(404, 'Booking not found'));
     }
    
        booking.status = status || booking.status;
        booking.date = date || booking.date;
        booking.time = time || booking.time;
        booking.updated_at = Date.now();

        const updatedBooking = await booking.save();
        res.status(200).json(updatedBooking);
    } catch (err) {
        next(err);
   }
};

export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return next(errorHandler(404, 'Booking not found'));
        }

        // Ensure the booking belongs to the logged-in customer or is managed by the merchant
        if (booking.customer_id.toString() !== req.user.id && booking.merchant_id.toString() !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own bookings'));
        }

        await booking.deleteOne();
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        next(err);
    }
};