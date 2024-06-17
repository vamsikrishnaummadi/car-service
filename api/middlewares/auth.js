import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(400, "Access denied. No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }catch(err){
        next(errorHandler(400, "Invalid token"));
    }
};

export const verifyMerchant = async(req, res, next) => {
     try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'merchant') {
            return next(errorHandler(400, "Access denied. Only merchants are allowed"));
        }
        next();
     }catch(err) {
        next(err);
     }
};

export const verifyCustomer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'customer') {
            return next(errorHandler(403, 'Access denied. Only customers are allowed.'));
        }
        next();
    } catch (err) {
        next(err);
    }
};

