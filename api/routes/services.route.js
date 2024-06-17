import express from "express";
import { verifyToken,verifyMerchant } from "../middlewares/auth.js";
import { createService, getServices, getServiceById, updateService, deleteService, getServicesByMerchantId } from "../controllers/service.controller.js";

const router = express.Router();

// create new service
router.post('/create', verifyToken, verifyMerchant,createService);

// get all services
router.get("/", getServices);

// get service by ID
router.get("/:id", getServiceById);

//  get services by merchent ID
router.get("/merchant/:merchantId", getServicesByMerchantId)

// update service by Id
router.put("/:id",verifyToken, verifyMerchant, updateService);

// delete service by Id
router.delete("/:id",verifyToken,verifyMerchant, deleteService);

export default router;