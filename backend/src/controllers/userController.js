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
        newUser.password = undefined; //hide password in response

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
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
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        //check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Incorrect password"});
        }

        const token = generateToken(user._id);
        user.password = undefined; //hide password in response

        res.status(200).json({
            message: "User logged in successfully",
            user,
            token,
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}