import mongoose from "mongoose";

const DB_NAME = "EmployeeManagement";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log(
            `\nMongoDB connected - DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MongoDB connection FAILED: -  ", error);
        process.exit(1);
    }
};

export default connectDB;
