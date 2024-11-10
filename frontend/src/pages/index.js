import { lazy } from "react";

import Home from "./Home";
const LoginPage = lazy(() => import("./LoginPage"));
const EmployeeList = lazy(() => import("./EmployeeList"));
const CreateEmployee = lazy(() => import("./CreateEmployee"));
const EditEmployee = lazy(() => import("./EditEmployee"));

export { Home, LoginPage, EmployeeList, CreateEmployee, EditEmployee };
