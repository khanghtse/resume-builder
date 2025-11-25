import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
    return token;
}

// post: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({message: "Please fill all required fields"});
        }

        //check if user already exists
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        const token = generateToken(newUser._id);
        const { password: newPassword, ...userDetails } = newUser.toObject();

        res.status(201).json({
            message: "User registered successfully",
            user: userDetails,
            token,
        });

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// post: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //check if required fields are present
        if (!email || !password) {
            return res.status(400).json({message: "Please fill all required fields"});
        }

        //check if user exists
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        //check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Incorrect password"});
        }

        const token = generateToken(user._id);
        const { password: hashedPassword, ...userDetails } = user.toObject();

        res.status(200).json({
            message: "User logged in successfully",
            user: userDetails,
            token,
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// get: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        // check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const { password, ...userDetails } = user.toObject();
        return res.status(200).json({user: userDetails});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}
