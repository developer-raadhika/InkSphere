
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import Footer from "./common/Footer";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // New story states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Edit story states
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://inksphere-backend-1h2f.onrender.com/api/blogs"
      );

      const blogData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setBlogs(blogData);
    } catch (err) {
      console.error("Blogs fetching error:", err);
      setError("Unable to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check admin access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();

          const response = await axios.get(
            "https://inksphere-backend-1h2f.onrender.com/api/admin/check",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIsAdmin(response.data.success === true);
        } catch (err) {
          console.log("Admin access not available.");
          setIsAdmin(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Like a story
  const handleLike = async (id) => {
    try {
      await axios.patch(
        `https://inksphere-backend-1h2f.onrender.com/api/blogs/like/${id}`
      );

      fetchBlogs();
    } catch (err) {
      console.error("Like error:", err);
      alert("Unable to like this story.");
    }
  };

  // Publish a new story
  const handleNewBlogSubmit = async (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      const token = await user.getIdToken();

      await axios.post(
        "https://inksphere-backend-1h2f.onrender.com/api/blogs",
        {
          newTitle,
          newContent,
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewTitle("");
      setNewContent("");
      setImageUrl("");

      alert("Your story has been published successfully!");

      fetchBlogs();
    } catch (err) {
      console.error("Publish error:", err);
      alert(
        err.response?.data?.message ||
        "Unable to publish your story."
      );
    }
  };

  // Open edit form
 const handleEditClick = (blog) => {
 

  setEditingId(blog._id);
  setEditTitle(blog.newTitle || "");
  setEditContent(blog.newContent || "");
  setEditImageUrl(blog.imageUrl || "");
};

  // Update story
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      const token = await user.getIdToken();

      await axios.put(
        `https://inksphere-backend-1h2f.onrender.com/api/blogs/${editingId}`,
        {
          newTitle: editTitle,
          newContent: editContent,
          imageUrl: editImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Story updated successfully!");

      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      setEditImageUrl("");

      fetchBlogs();
    } catch (err) {
      console.error("Update error:", err);
      alert(
        err.response?.data?.message ||
        "Unable to update story."
      );
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditImageUrl("");
  };

  // Delete story
  const handleDeleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );

    if (!confirmDelete) return;

    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      const token = await user.getIdToken();

      await axios.delete(
        `https://inksphere-backend-1h2f.onrender.com/api/blogs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Story deleted successfully!");

      if (editingId === id) {
        handleCancelEdit();
      }

      fetchBlogs();
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        err.response?.data?.message ||
        "Unable to delete story."
      );
    }
  };

  // Search stories
  const filteredBlogs = blogs.filter((blog) => {
    const title = blog.newTitle || "";
    const content = blog.newContent || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <div className="min-h-screen bg-[#faf7f2] px-5 md:px-12 py-12">

        {/* Page Heading */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-orange-500 uppercase tracking-[4px] text-sm font-semibold mb-4">
            Explore Our Collection
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5">
            Stories That <span className="text-orange-500">Inspire</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover thoughts, ideas, experiences and stories
            shared by the InkSphere community.
          </p>
        </div>

        {/* Admin Publish Form */}
        {isAdmin && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Publish a New Story
            </h2>

            <form onSubmit={handleNewBlogSubmit}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter your story title"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500"
              />

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your story here..."
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500 resize-y"
              />

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter story image URL (optional)"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                className="bg-orange-500 text-white px-7 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Publish Story →
              </button>
            </form>
          </div>
        )}

        {/* Admin Edit Form */}
       {isAdmin && editingId !== null && (
          <div className="max-w-3xl mx-auto bg-orange-50 border border-orange-200 rounded-2xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Your Story
            </h2>

            <form onSubmit={handleUpdateBlog}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Story title"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500"
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Story content"
                rows="7"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500 resize-y"
              />

              <input
                type="text"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Story image URL (optional)"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-orange-500"
              />

              <div className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories by title or content..."
            className="w-full bg-white border border-gray-200 rounded-full px-6 py-4 outline-none focus:border-orange-500 shadow-sm"
          />

          {search.trim() !== "" && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "story" : "stories"} found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-lg py-10">
            Loading your stories...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>

            <button
              onClick={fetchBlogs}
              className="bg-orange-500 text-white px-6 py-2 rounded-full"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && filteredBlogs.length > 0 && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col"
              >
                <img
                  src={
                    blog.imageUrl ||
                    (blog.newTitle?.toLowerCase().includes("creativity")
                      ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                      : "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80")
                  }
                  alt={blog.newTitle}
                  className="w-full h-52 object-cover rounded-lg"
                />

                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-orange-500 text-sm font-semibold mb-3">
                    INKSPHERE STORIES
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {blog.newTitle}
                  </h2>

                  <p className="text-gray-500 text-sm mb-4">
                    {blog.date || "Recently published"}
                  </p>

                  <p className="text-gray-600 leading-7 line-clamp-3 mb-6">
                    {blog.newContent}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 flex-wrap">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-orange-600 font-semibold hover:text-orange-800"
                    >
                      Read Full Story →
                    </Link>

                    <button
                      onClick={() => handleLike(blog._id)}
                      className="text-gray-600 hover:text-red-500 font-medium"
                    >
                      ❤️ {blog.likes || 0}
                    </button>
                  </div>

                  {/* Admin Edit and Delete Buttons */}
                  {isAdmin && (
                    <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                      <button
  type="button"
  onClick={() => handleEditClick(blog)}
  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
>
  ✏️ Edit
</button>

                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}

          </div>
        )}

        {/* No Stories */}
        {!loading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {search.trim()
                ? "No stories found!"
                : "No stories published yet."}
            </h2>

            <p className="text-gray-500">
              {search.trim()
                ? "Try searching with another word."
                : "Come back soon for new stories."}
            </p>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}

export default Blogs;
