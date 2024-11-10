import React, { useId } from "react";

function Input({
    placeholder,
    type = "text",
    className = "",
    label = "",
    ...props
}) {
    const id = useId();
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-1 ml-2">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`border border-slate-200 rounded-md px-3 py-2 mt-1 mb-4 text-sm w-full ${className}`}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}

export default Input;
