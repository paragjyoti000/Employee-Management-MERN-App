import React from "react";

function Footer() {
    return (
        <footer className="mt-auto bg-slate-200 h-10 text-center">
            <div className="flex justify-center items-center h-full">
                <p>Copyright &copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}

export default Footer;
