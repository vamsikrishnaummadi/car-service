import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import errorHandler from "../utils/errorHandler.js";


export const Signup = async(req,res,next) => {
      const {username,email, role,name,phone,address,password} = req.body;

      if (!username || !email || !name || !phone || !address || !password || name === "" || username === "" || email === "" || password === "" || phone === "" || address === "") {
          return next(errorHandler(400, 'All fields are required'));
      }

      const isEmailExist = await User.findOne({email});
      if (isEmailExist) {
         return next(errorHandler(400, 'Email Already Exists'));
      }

      const hashedPassword = bcryptjs.hashSync(password,10);

      const newUser = new User({
        username,
        email,
        role,
        password : hashedPassword,
        name,
        phone,
        address
      });

      try {
        await newUser.save();
        res.status(200).json({message: "Successfully Created Profile"});
      }catch(err) {
        next(err);
      }
};

export const Signin = async (req,res,next) => {
    const {usernameOremail, password} = req.body;

    if (!usernameOremail || !password || usernameOremail === "" || password === ""){
        return next(errorHandler(400, "All fields are required"));
    }
    try {
        let validUser;
        if (usernameOremail.includes('@')) {
            validUser = await User.findOne({email : usernameOremail});
        }else {
            validUser = await User.findOne({username : usernameOremail});
        }

        if (!validUser) {
           return next(errorHandler(400, "User not found"));
        }

        const passwordValid = bcryptjs.compareSync(password, validUser.password);

        if (!passwordValid) {
            return next(errorHandler(400, "Invalid Password"));
        }

        const token = jwt.sign({id : validUser._id, role : validUser.role}, process.env.JWT_SECRET_KEY);

        const {password : pass, ...rest} = validUser._doc;

        res.status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 10000
            })
            .json(rest);
    }catch(err) {
        next(err);
    }
 };


