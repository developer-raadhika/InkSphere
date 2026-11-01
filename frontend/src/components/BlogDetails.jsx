
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "./common/Footer";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();

  // Blog state
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate reading time AFTER declaring blog
  const readingTime = blog?.newContent
    ? Math.max(
        1,
        Math.ceil(blog.newContent.split(/\s+/).length / 200)
      )
    : 0;

  // Fetch selected blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://inksphere-backend-1h2f.onrender.com/api/blogs"
        );

        const blogs = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        const selectedBlog = blogs.find(
          (item) => String(item._id || item.id) === String(id)
        );

        if (!selectedBlog) {
          setError("Story not found!");
        } else {
          setBlog(selectedBlog);
        }
      } catch (err) {
        setError("Unable to load this story. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading your story...</p>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || "Story not found!"}
        </h2>

        <Link
          to="/blogs"
          className="text-orange-600 font-semibold hover:underline"
        >
          ← Back to all stories
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#faf7f2] min-h-screen px-5 md:px-10 py-12">

        <article className="max-w-4xl mx-auto">

          {/* Back to Blogs */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-800 mb-8"
          >
            ← Back to all stories
          </Link>

          {/* Blog Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center leading-tight mb-8">
            {blog.newTitle}
          </h1>

          {/* Author and Blog Details */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <span>By InkSphere Editorial Team</span>
            <span>•</span>
            <span>{blog.date || "Recently published"}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
            <span>•</span>
            <span>❤️ {blog.likes || 0} Likes</span>
          </div>

          {/* Blog Cover Image */}
          <div className="mb-12">
          
<img
  src={
    blog.imageUrl ||
    (blog.newTitle?.toLowerCase().includes("creativity")
      ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80")
  }
  alt={blog.newTitle}
  className="w-full h-[280px] md:h-[450px] object-cover rounded-2xl shadow-md"
/>

          </div>

          {/* Full Blog Content */}
          <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm">

            <div className="whitespace-pre-wrap text-lg leading-9 text-gray-700 md:text-xl">
              {blog.newContent}
            </div>

            {/* Share Story */}
            <div className="border-t border-gray-200 mt-10 pt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-500">
                Enjoyed this story? Share it with others!
              </p>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                    .then(() => alert("Story link copied successfully!"))
                    .catch(() => alert("Unable to copy the link."));
                }}
                className="px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Share Story ↗
              </button>
            </div>

          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <Link
              to="/blogs"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-orange-500 transition"
            >
              Explore More Stories →
            </Link>
          </div>

        </article>
      </div>

      <Footer />
    </>
  );
}

export default BlogDetails;
