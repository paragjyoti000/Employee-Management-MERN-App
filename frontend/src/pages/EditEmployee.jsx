import React, { Suspense, useEffect, useState } from "react";
import { EmployeeForm } from "../components";
import { useSearchParams } from "react-router-dom";
import serviceApi from "../api/serviceApi";

function EditEmployee() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        serviceApi
            .getEmployeeById(id)
            .then((data) => setEmployee(data))
            .finally(() => setLoading(false));
    }, [id]);
    return loading ? (
        <div className="loading">Loading...</div>
    ) : (
        <Suspense fallback={<div className="loading">Loading...</div>}>
            <EmployeeForm employee={employee} />
        </Suspense>
    );
}

export default EditEmployee;
