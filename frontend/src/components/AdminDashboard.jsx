
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const API = "https://inksphere-backend-1h2f.onrender.com/api";

function AdminDashboard() {
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getToken = async () => {
        const user = auth.currentUser;
        if (!user) throw new Error("Please login first.");
        return await user.getIdToken();
    };

    const fetchBlogs = async () => {
        const response = await axios.get(`${API}/blogs`);
        setBlogs(response.data);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setChecking(true);
            setAuthorized(false);

            if (!user) {
                setError("Please login with your admin account.");
                setChecking(false);
                return;
            }

            try {
                const token = await user.getIdToken();

                await axios.get(`${API}/admin/check`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAuthorized(true);
                setError("");
                await fetchBlogs();
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "You are not authorized to access this dashboard."
                );
            } finally {
                setChecking(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const token = await getToken();

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const today = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            const data = {
                newTitle: title,
                newContent: content,
                date: today
            };

            if (editId) {
                await axios.put(`${API}/blogs/${editId}`, data, config);
                setMessage("Blog updated successfully!");
            } else {
                await axios.post(`${API}/blogs`, data, config);
                setMessage("Blog published successfully!");
            }

            setTitle("");
            setContent("");
            setEditId(null);
            await fetchBlogs();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to save blog."
            );
        }
    };

    const handleEdit = (blog) => {
        setEditId(blog._id);
        setTitle(blog.newTitle);
        setContent(blog.newContent);
        setMessage("");
        setError("");
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) {
            return;
        }

        try {
            const token = await getToken();

            await axios.delete(`${API}/blogs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Blog deleted successfully!");
            await fetchBlogs();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to delete blog."
            );
        }
    };

    if (checking) {
        return <p className="text-center py-20">Checking admin access...</p>;
    }

    if (!authorized) {
        return (
            <div className="text-center py-20 px-4">
                <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-center">
                    InkSphere Admin
                </h1>

                <p className="text-center text-gray-500 mb-10">
                    Manage your stories and publications.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow mb-10"
                >
                    <h2 className="text-2xl font-semibold mb-5">
                        {editId ? "Edit Blog" : "Create New Blog"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Blog title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-3 rounded mb-4"
                        required
                    />

                    <textarea
                        placeholder="Write your blog content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border p-3 rounded mb-4"
                        rows="6"
                        required
                    />

                    <div className="flex gap-3 flex-wrap">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
                        >
                            {editId ? "Update Blog" : "Publish Blog"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setTitle("");
                                    setContent("");
                                }}
                                className="bg-gray-500 text-white px-6 py-3 rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {message && (
                        <p className="text-green-600 mt-4">{message}</p>
                    )}

                    {error && (
                        <p className="text-red-600 mt-4">{error}</p>
                    )}
                </form>

                <h2 className="text-2xl font-bold mb-5">
                    Published Blogs ({blogs.length})
                </h2>

                <div className="grid gap-5">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white p-6 rounded-xl shadow"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                {blog.newTitle}
                            </h3>

                            <p className="text-gray-500 text-sm mb-3">
                                {blog.date}
                            </p>

                            <p className="text-gray-700 mb-5">
                                {blog.newContent}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(blog)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {blogs.length === 0 && (
                        <p className="text-gray-500">No blogs published yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
