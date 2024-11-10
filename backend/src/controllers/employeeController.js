import Employee from "../models/employeeModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";

const generateEID = async () => {
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    if (!lastEmployee) {
        return "EID-001";
    }

    const lastEID = lastEmployee.EID;
    const lastSerialNumber = parseInt(lastEID.split("-")[1], 10);
    const newSerialNumber = lastSerialNumber + 1;

    const newEID = `EID-${String(newSerialNumber).padStart(3, "0")}`;

    return newEID;
};

export const createEmployee = asyncHandler(async (req, res) => {
    const { name, email, mobile, designation, gender, course } = req.body;

    if (!name || !email || !mobile || !designation || !gender || !course) {
        throw new ApiError(400, "All fields are required");
    }

    const image = req.file?.path;

    if (!image) {
        throw new ApiError(411, "Image is required");
    }

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
        fs.unlinkSync(image, (err) => {
            if (err) {
                console.log(err);
            }
        });
        throw new ApiError(409, "Employee already exists with this email");
    }

    const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const mobileRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email");
    } else if (!mobileRegex.test(mobile)) {
        throw new ApiError(400, "Invalid mobile number");
    }

    const EID = await generateEID();

    const employee = await Employee.create({
        EID,
        name,
        email,
        mobile,
        designation,
        gender,
        course,
        image,
    });

    if (!employee) {
        fs.unlinkSync(image, (err) => {
            if (err) {
                console.log(err);
            }
        });
        throw new ApiError(500, "Failed to create employee");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Employee created", employee));
});

export const editEmployee = asyncHandler(async (req, res) => {
    const { name, email, mobile, designation, gender, course } = req.body;

    if (!name || !email || !mobile || !designation || !gender || !course) {
        throw new ApiError(400, "All fields are required");
    }

    const existingEmployee = await Employee.find({
        _id: { $ne: req.params.id },
    }).findOne({ email });

    if (existingEmployee) {
        throw new ApiError(409, "Employee already exists with this email");
    }

    const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const mobileRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email");
    } else if (!mobileRegex.test(mobile)) {
        throw new ApiError(400, "Invalid mobile number");
    }

    const image = req.file?.path;

    if (image && image !== undefined) {
        const unEditedEmployee = await Employee.findById(req.params.id);
        console.log(unEditedEmployee);

        fs.unlinkSync(unEditedEmployee.image, (err) => {
            if (err) {
                new ApiError(500, "Failed to delete cover image");
            }

            console.log(
                "Cover image deleted successfully !! ",
                unEditedEmployee.image
            );
        });
    }

    const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image,
        },
        {
            new: true,
        }
    );

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Employee updated", employee));
});

export const getAllEmployees = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query?.limit) || 10;
    const page = parseInt(req.query?.page) || 1;
    const skip = (page - 1) * limit;

    const employees = await Employee.find({}).skip(skip).limit(limit);

    const totalEmployees = await Employee.countDocuments();

    const totalPages = Math.ceil(totalEmployees / limit);

    if (employees.length === 0) {
        throw new ApiError(404, "Employees not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Employees fetched", {
            employees,
            metadata: { page, limit, totalEmployees, totalPages },
        })
    );
});

export const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Employee fetched", employee));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    fs.unlinkSync(employee.image, (err) => {
        if (err) {
            new ApiError(500, "Failed to delete cover image");
        }

        console.log("Cover image deleted successfully !! ", employee.image);
    });

    return res.status(200).json(new ApiResponse(200, "Employee deleted"));
});

export const searchEmployee = asyncHandler(async (req, res) => {
    const searchQuery = req.query.query;
    const limit = parseInt(req.query?.limit) || 10;
    const page = parseInt(req.query?.page) || 1;
    const skip = (page - 1) * limit;

    if (!searchQuery) {
        throw new ApiError(400, "Search query is required");
    }

    if (searchQuery.length < 3) {
        throw new ApiError(
            400,
            "Search query must be at least 3 characters long"
        );
    }

    const employees = await Employee.find({
        $or: [
            { EID: { $regex: searchQuery, $options: "i" } },
            { name: searchQuery },
            { email: { $regex: searchQuery, $options: "i" } },
        ],
    })
        .skip(skip)
        .limit(limit);

    return res
        .status(200)
        .json(new ApiResponse(200, "Search results", employees));
});

export const getAllEmployeesEnums = asyncHandler(async (req, res) => {
    const designation = await Employee.schema.path("designation").enumValues;
    const gender = await Employee.schema.path("gender").enumValues;
    const course = await Employee.schema.path("course").enumValues;

    return res.status(200).json(
        new ApiResponse(200, "Enums fetched", {
            designation,
            gender,
            course,
        })
    );
});
