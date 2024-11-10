import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        EID: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: Number,
            required: true,
            unique: true,
        },
        designation: {
            type: String,
            required: true,
            enum: ["HR", "Manager", "Sales"],
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
        course: {
            type: String,
            required: true,
            enum: ["MCA", "BCA", "BSC"],
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
