import Service from "../models/service.model.js";
import errorHandler from "../utils/errorHandler.js";


export const createService = async (req, res, next) => {
    const services = req.body; // Assuming req.body is an array of service objects
    const merchant_id = req.user.id;

    if (!Array.isArray(services)) {
        return next(errorHandler(400, 'Invalid input. Expected an array of services.'));
    }

    try {
        const savedServices = [];
        const duplicateServices = [];

        for (const service of services) {
            const { service_name, description, price, duration } = service;

            if (!service_name || !description || !price || !duration) {
                return next(errorHandler(400, 'All fields are required for each service.'));
            }

            const existingService = await Service.findOne({ merchant_id, service_name });
            if (existingService) {
                duplicateServices.push(service_name);
                continue; // Skip this service as it already exists
            }

            const newService = new Service({
                merchant_id,
                service_name,
                description,
                price,
                duration
            });

            const savedService = await newService.save();
            savedServices.push(savedService);
        }

        if (duplicateServices.length > 0) {
            res.status(207).json({
                message: 'Some services were not created due to duplicate names',
                created_services: savedServices,
                duplicate_services: duplicateServices
            });
        } else {
            res.status(201).json(savedServices);
        }
    } catch (err) {
        next(err);
    }
};


export const getServices = async(req,res,next) => {
        try {
            const services = await Service.find();
            res.status(200).json(services);
        }catch(err) {
            next(err);
        }
};
 
export const getServiceById = async(req,res,next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return next(errorHandler(404, 'Service not found'));
        }
        res.status(200).json(service);
    } catch (err) {
        next(err);
    }
};

export const getServicesByMerchantId = async (req, res, next) => {
    const { merchantId } = req.params;
    const { page = 1, limit = 25 } = req.query; // Default values: page 1, limit 25

    try {
        const services = await Service.find({ merchant_id: merchantId })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        // Get total count of services for pagination info
        const count = await Service.countDocuments({ merchant_id: merchantId });

        res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            services
        });
    } catch (err) {
        next(err);
    }
};

export const updateService = async(req,res,next) => {
    
    
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return next(errorHandler(404, "service not found"));
        }

        // Ensure Service belongs to logged merchant  

        if (service.merchant_id.toString() !== req.user.id) {
            return next(errorHandler(403, "You can only update your own services"));
        }

        service.service_name = service_name || service.service_name;
        service.description = description || service.description;
        service.price = price || service.price;
        service.duration = duration || service.duration;
        service.updated_at = Date.now();

        const updatedService = await service.save();
        res.status(200).json(service);

    }catch(err) {
        next(err);
    }
};

export const deleteService = async(req,res,next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return next(errorHandler(404, 'Service not found'));
        }

        // Ensure the service belongs to the logged-in merchant
        if (service.merchant_id.toString() !== req.user.id) {
            return next(errorHandler(403, 'You can only delete your own services'));
        }

        await service.deleteOne();
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        next(err);
    }
};