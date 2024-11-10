import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice";
import authApi from "./api/authApi";
import { Header, Footer } from "./components";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        setIsLoading(true);
        try {
            authApi.getCurrentUser().then((user) => {
                dispatch(login(user));
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);
    return isLoading ? (
        <div className="loading">Loading...</div>
    ) : (
        <div className="flex flex-col bg-slate-100 h-screen w-full">
            <Header />
            <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-200">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default App;
