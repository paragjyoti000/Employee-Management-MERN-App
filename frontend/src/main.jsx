import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./components/Authentication.jsx";
import { Suspense } from "react";
import {
    CreateEmployee,
    EditEmployee,
    EmployeeList,
    Home,
    LoginPage,
} from "./pages";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route
                        path="/"
                        element={
                            <Authentication required>
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <Home />
                                </Suspense>
                            </Authentication>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Authentication required={false}>
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <LoginPage />
                                </Suspense>
                            </Authentication>
                        }
                    />
                    <Route
                        path="/employee-list"
                        element={
                            <Authentication required>
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <EmployeeList />
                                </Suspense>
                            </Authentication>
                        }
                    />
                    <Route
                        path="/create-employee"
                        element={
                            <Authentication required>
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <CreateEmployee />
                                </Suspense>
                            </Authentication>
                        }
                    />
                    <Route
                        path="/edit-employee"
                        element={
                            <Authentication required>
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <EditEmployee />
                                </Suspense>
                            </Authentication>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);
