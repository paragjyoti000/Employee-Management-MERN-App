import { lazy } from "react";

import Header from "./Header";
import Footer from "./Footer";
const EmployeeForm = lazy(() => import("./EmployeeForm"));
import Input from "./Input";
import Select from "./Select";

export { Header, Footer, EmployeeForm, Input, Select };
