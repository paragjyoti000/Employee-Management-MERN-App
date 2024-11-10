import React, { useEffect, useState } from "react";
import serviceApi from "../api/serviceApi";
import { useNavigate } from "react-router-dom";
import config from "../config";

function EmployeeList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setError(null);

        if (searchQuery !== undefined && searchQuery.length > 2) {
            // search employees
            setIsLoading(true);
            serviceApi
                .searchEmployees(searchQuery, page, limit)
                .then((data) => {
                    setEmployees(data);
                })
                .catch((error) => {
                    setError(error);
                    setEmployees([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            // get all employees
            setIsLoading(true);
            serviceApi
                .getAllEmployees(page, limit)
                .then((data) => {
                    setEmployees(data.employees);
                    setMetadata(data.metadata);
                })
                .catch((error) => {
                    setError(error);
                    setEmployees([]);
                    setMetadata({});
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [page, limit, searchQuery]);

    const deleteEmployee = (id) => {
        // delete employee
        setError(null);
        setIsLoading(true);
        serviceApi
            .deleteEmployee(id)
            .then(() => {
                serviceApi
                    .getAllEmployees(page, limit)
                    .then((data) => {
                        setEmployees(data.employees);
                        setMetadata(data.metadata);
                    })
                    .catch((error) => {
                        setError(error);
                        setEmployees([]);
                        setMetadata({});
                    });
            })
            .finally(() => {
                setIsLoading(false);
                setShowConfirmationModal(false);
            });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center w-[30%] ml-auto mb-4">
                <div>Total Employees: {metadata.totalEmployees || 0}</div>
                <button
                    onClick={() => navigate("/create-employee")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                >
                    Create Employee
                </button>
            </div>

            <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
                <div className="flex justify-between w-full py-2 px-4">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <label htmlFor="page">Page:</label>
                            <select
                                id="page"
                                value={page}
                                onChange={(e) =>
                                    setPage(Number(e.target.value))
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 ml-2"
                            >
                                {[...Array(metadata.totalPages)].map(
                                    (_, index) => (
                                        <option
                                            key={index + 1}
                                            value={index + 1}
                                        >
                                            {index + 1}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="flex items-center ml-4">
                            <label htmlFor="limit">Limit:</label>
                            <select
                                id="limit"
                                value={limit}
                                onChange={(e) =>
                                    setLimit(Number(e.target.value))
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 ml-2"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {error?.search && (
                            <span className="text-red-500 ml-2">
                                {error.search}
                            </span>
                        )}
                        <div className="flex items-center">
                            <label htmlFor="search">Search:</label>
                            <input
                                type="text"
                                id="search"
                                className="border border-gray-300 rounded-md px-2 py-1 ml-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() =>
                                    setError({
                                        search: "At least 3 characters",
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <table className="data-table w-full border-collapse">
                    <thead className="">
                        <tr>
                            <th>Unique ID</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Designation</th>
                            <th>Gender</th>
                            <th>Course</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {employees.length !== 0 && (
                            <>
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.EID}</td>
                                        <td className="flex justify-center">
                                            <img
                                                src={`${config.baseURL}/${employee.image}`}
                                                alt={employee.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.mobile}</td>
                                        <td>{employee.designation}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.course}</td>
                                        <td>
                                            {new Date(employee.createdAt)
                                                .toUTCString()
                                                .slice(0, 16)}
                                        </td>
                                        <td className="">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/edit-employee?id=${employee._id}`
                                                        )
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowConfirmationModal(
                                                            true
                                                        )
                                                    }
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                                                >
                                                    Delete
                                                </button>
                                                {showConfirmationModal && (
                                                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                                        <div className="bg-white p-4 rounded shadow-md">
                                                            <h2 className="text-lg font-semibold mb-2">
                                                                Confirm Delete
                                                            </h2>
                                                            <p className="text-gray-600">
                                                                Are you sure you
                                                                want to delete
                                                                this employee?
                                                            </p>
                                                            <div className="flex justify-center gap-2 mt-4">
                                                                <button
                                                                    onClick={() =>
                                                                        setShowConfirmationModal(
                                                                            false
                                                                        )
                                                                    }
                                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteEmployee(
                                                                            employee._id
                                                                        )
                                                                    }
                                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                                                                >
                                                                    Confirm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>

                {employees.length === 0 && (
                    <div className="text-center text-xl font-bold my-4">
                        No employees found
                    </div>
                )}
                {isLoading && <div className="loading">Loading...</div>}
            </div>
        </div>
    );
}

export default EmployeeList;
