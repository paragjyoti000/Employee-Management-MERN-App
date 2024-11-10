import React, { useEffect, useState } from "react";
import serviceApi from "../api/serviceApi";
import { Input, Select } from "./";
import { useNavigate } from "react-router-dom";

function EmployeeForm({ employee }) {
    const navigate = useNavigate();
    const [enums, setEnums] = useState({});

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");

    console.log(errors);

    const [data, setData] = useState({
        name: employee?.name || "",
        email: employee?.email || "",
        mobile: employee?.mobile || "",
        designation: employee?.designation || "",
        gender: employee?.gender || "",
        course: employee?.course || "",
    });

    const handleOnChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("designation", data.designation);
    formData.append("gender", data.gender);
    formData.append("course", data.course);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        if (employee) {
            serviceApi
                .updateEmployee(employee._id, formData)
                .then((res) => {
                    if (res) {
                        navigate("/employee-list");
                    }
                })
                .catch((err) => {
                    if (err.status === 409) {
                        setErrors("Email address already exists");
                    } else if (err.status >= 500) {
                        setErrors("Something went wrong");
                    } else if (err.status === 400) {
                        setErrors("Invalid data");
                    } else if (err.status === 404) {
                        setErrors("Employee not found");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            serviceApi
                .createEmployee(formData)
                .then((res) => {
                    if (res) {
                        navigate("/employee-list");
                    }
                })
                .catch((err) => {
                    if (err.status === 409) {
                        setErrors("Email address already exists");
                    } else if (err.status >= 500) {
                        setErrors("Something went wrong");
                    } else if (err.status === 400) {
                        setErrors("Invalid data");
                    } else if (err.status === 411) {
                        setErrors("Image is required");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        serviceApi.getAllEmployeesEnums().then((data) => setEnums(data));
    }, []);

    return (
        <div className="relative flex justify-center items-center h-full p-5">
            {errors && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors}
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 flex flex-col items-center"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div>
                            <Input
                                type="text"
                                placeholder="Name"
                                label="Name"
                                name="name"
                                value={data.name}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Email Address"
                                label="Email Address"
                                name="email"
                                value={data.email}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                placeholder="Mobile"
                                label="Mobile (10 digits)"
                                name="mobile"
                                value={data.mobile}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <Select
                                name="designation"
                                type="text"
                                options={enums.designation}
                                label="Designation"
                                value={data.designation}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div>
                            <Select
                                name="gender"
                                options={enums.gender}
                                label="Gender"
                                value={data.gender}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div>
                            <Select
                                name="course"
                                options={enums.course}
                                label="Course"
                                value={data.course}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Input
                            type="file"
                            name="image"
                            accept="image/png, image/jpeg"
                            label="Profile Picture"
                            onChange={(e) => {
                                formData.append("image", e.target.files[0]);
                            }}
                        />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className={`px-8 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading
                            ? "Loading..."
                            : employee
                            ? "Update"
                            : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeForm;
