import express from "express";
import { Signin,Signup } from "../controllers/auth.controller.js";

const router = express.Router();

// Create New Account
router.post("/signup",Signup);

// Login with Excisting Account
router.post("/signin",Signin);

export default router;