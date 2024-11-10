import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authApi from "../api/authApi";
import { logout } from "../store/authSlice";

const pages = [
    { path: "/", name: "Dashboard" },
    { path: "/employee-list", name: "Employee List" },
    { path: "/login", name: "Login Page" },
    { path: "/create-employee", name: "Create Employee" },
    { path: "/edit-employee", name: "Edit Employee" },
];

function Header() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isLoggedIn = useSelector((state) => state.auth.status);

    const [cuurentPage, setCurrentPage] = useState("Home");

    useEffect(() => {
        const currentPage = pages.find(
            (page) => page.path === location.pathname
        );
        setCurrentPage(currentPage ? currentPage.name : "Home");
    }, [location.pathname]);

    const logoutHandler = () => {
        authApi
            .logout()
            .then(() => {
                dispatch(logout());
                navigate("/login");
            })
            .catch((error) => console.log(error));
    };

    return (
        <header className="">
            <h1 className="text-2xl font-bold px-4 py-2">Logo</h1>
            {isLoggedIn && (
                <div className="flex items-center bg-slate-200 px-4 py-2">
                    <div className="flex justify-between w-[90%] ml-auto items-center">
                        <nav>
                            <ul className="flex gap-5">
                                <li
                                    className={` ${
                                        location.pathname === "/"
                                            ? "font-bold"
                                            : ""
                                    }`}
                                >
                                    <Link
                                        to="/"
                                        className="px-4 py-2 rounded-md hover:bg-blue-200"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li
                                    className={`${
                                        location.pathname === "/employee-list"
                                            ? "font-bold"
                                            : ""
                                    }`}
                                >
                                    <Link
                                        to="/employee-list"
                                        className="px-4 py-2 rounded-md hover:bg-blue-200"
                                    >
                                        Employee List
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="flex items-center gap-8">
                            <div className="font-bold">{user?.username}</div>
                            <button
                                className="bg-red-300 hover:bg-red-400 py-1 px-2 rounded-md"
                                onClick={logoutHandler}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="px-4 py-2 bg-yellow-200">{cuurentPage}</div>
        </header>
    );
}

export default Header;
