import React, { useId } from "react";

function Select({ options = [], name = "", label, className = "", ...props }) {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="block mb-1 ml-2">
                {label}
            </label>
            <select
                name={name}
                id={id}
                className={`border border-slate-200 rounded-md px-3 py-2 mt-1 mb-4 text-sm w-full ${className}`}
                value={props.value || ""}
                {...props}
            >
                <option value="" disabled>
                    Select
                </option>
                {options?.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
