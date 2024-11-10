import React, { Suspense } from "react";
import { EmployeeForm } from "../components";

function CreateEmployee() {
    return (
        <Suspense fallback={<div className="loading">Loading...</div>}>
            <EmployeeForm />
        </Suspense>
    );
}

export default CreateEmployee;
