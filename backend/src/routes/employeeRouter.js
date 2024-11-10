import { Router } from "express";
import {
    createEmployee,
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    getAllEmployeesEnums,
    getEmployeeById,
    searchEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = Router();

router.get("/get-employee-enums", protect, getAllEmployeesEnums);

router.post(
    "/create-employee",
    protect,
    upload.single("image"),
    createEmployee
);

router.get("/get-all-employees", protect, getAllEmployees);

router.get("/search-employee", protect, searchEmployee);

router.get("/get-employee/:id", protect, getEmployeeById);

router.delete("/delete-employee/:id", protect, deleteEmployee);

router.patch(
    "/edit-employee/:id",
    protect,
    upload.single("image"),
    editEmployee
);

export default router;
