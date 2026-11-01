import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setIsAdmin(false);

            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();

                    const response = await fetch(
                        "https://inksphere-backend-1h2f.onrender.com/api/admin/check",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    setIsAdmin(response.ok);
                } catch (error) {
                    console.error("Admin verification failed:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsAdmin(false);
            navigate("/home");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="py-4 px-3 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link to="/home" className="text-2xl font-bold">
                InkSphere<span className="text-orange-500">.</span>
            </Link>

            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-3">
                <Link className="px-2 sm:px-3" to="/home">
                    Home
                </Link>

                <Link className="px-2 sm:px-3" to="/blogs">
                    Blogs
                </Link>

                <Link className="px-2 sm:px-3" to="/home">
                    About
                </Link>

                {isAdmin && (
                    <Link
                        className="px-2 sm:px-3 font-semibold text-orange-500"
                        to="/admin"
                    >
                        Admin
                    </Link>
                )}

                {user ? (
                    <button
                        className="button-style"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        className="button-style"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;