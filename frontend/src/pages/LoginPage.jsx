import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Form state
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Input handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }
    };

    // Password validation
    const validatePassword = (password) => {
        if (password.length < 6) {
            setErrors({
                ...errors,
                password: "Password must be at least 6 characters long",
            });
        } else {
            setErrors((err) => {
                const { password, ...rest } = err;
                return rest;
            });
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        await authApi
            .login(formData.username, formData.password)
            .then((response) => {
                if (response) {
                    dispatch(login(response.user));
                    navigate("/");
                }
            })
            .catch((error) => {
                if (error.status === 404) {
                    setErrors({
                        username: "User not found",
                    });
                }
                if (error.status === 401) {
                    setErrors({ password: "Invalid password" });
                }
                if (error.status >= 500) {
                    setErrors({
                        login: "Something went wrong",
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Login
                </h1>

                {/* Login error message */}
                {errors.login && (
                    <p className="text-red-500 text-sm mt-2">{errors.login}</p>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                            aria-label="Username input field"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                            aria-required="true"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                            aria-label="Password input field"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                } transition-all duration-200`}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                aria-required="true"
                                aria-invalid={
                                    errors.password ? "true" : "false"
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <FaEyeSlash size={20} />
                                ) : (
                                    <FaEye size={20} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p
                                className="mt-2 text-sm text-red-600"
                                role="alert"
                            >
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner
                                    className="animate-spin mr-2"
                                    size={20}
                                />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
