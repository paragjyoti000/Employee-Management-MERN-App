import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Authentication({ children, required = true }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.status);

    useEffect(() => {
        setLoading(true);
        if (required && isLoggedIn !== required) {
            navigate("/login");
        } else if (!required && isLoggedIn !== required) {
            navigate("/");
        }
        setLoading(false);
    }, [isLoggedIn, navigate, required]);

    return loading ? (
        <div className="loading">Loading...</div>
    ) : (
        <>{children}</>
    );
}

export default Authentication;
