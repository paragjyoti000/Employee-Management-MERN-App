import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    } else if (username.length < 3) {
        throw new ApiError(400, "Username must be at least 3 characters long");
    } else if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const user = await User.findById(newUser._id).select("-password");

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "User created successfully", user));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid Password");
    }

    const token = generateToken(user._id);

    const userWithoutPassword = await User.findById(user._id).select(
        "-password"
    );

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            secure: true,
        })
        .json(
            new ApiResponse(200, "Login successful", {
                user: userWithoutPassword,
                token,
            })
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            secure: true,
        })
        .json(new ApiResponse(200, "Logout successful"));
});

export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, "User found", user));
});
