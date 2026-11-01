import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./common/Footer";

function Home() {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categories = [
        "Technology",
        "Creativity",
        "Lifestyle",
        "Personal Growth"
    ];

    // Fetch latest blogs from MongoDB
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/blogs");

                if (!response.ok) {
                    throw new Error("Unable to load blogs.");
                }

                const result = await response.json();

                const blogData = Array.isArray(result)
                    ? result
                    : result.data || [];

                setBlogs(blogData);
            } catch (err) {
                setError("Unable to load stories. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const latestBlogs = blogs.slice(0, 2);

    const blogImages = [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000"
    ];

    const formatDate = (date) => {
        if (!date) return "Recently published";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Recently published";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="bg-[#faf8f3] text-[#25231f]">

            {/* Hero Section */}
            <section className="px-6 md:px-16 py-20 md:py-28">
                <p className="uppercase tracking-[5px] text-orange-600 font-semibold text-sm mb-6">
                    Welcome to InkSphere
                </p>

                <div className="max-w-5xl">
                    <h1 className="text-5xl md:text-8xl font-serif font-bold leading-tight">
                        Where Every Thought
                        <span className="block text-orange-600 italic">
                            Finds Its Voice.
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
                        A creative corner for curious minds, meaningful
                        stories and fresh perspectives. Explore ideas
                        that inspire you to think, learn and grow.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-9">
                        <button
                            onClick={() => navigate("/blogs")}
                            className="bg-[#25231f] text-white px-8 py-4 rounded-full hover:bg-orange-600 transition"
                        >
                            Explore Stories →
                        </button>

                        <button
                            onClick={() => navigate("/home#about")}
                            className="border border-gray-400 px-8 py-4 rounded-full hover:bg-white transition"
                        >
                            Discover InkSphere
                        </button>
                    </div>
                </div>

                <div className="mt-16 border-y border-gray-300 py-5 flex flex-wrap justify-between gap-4 text-sm uppercase tracking-widest text-gray-500">
                    <span>Ideas worth sharing</span>
                    <span>Stories worth reading</span>
                    <span>Perspectives worth exploring</span>
                </div>
            </section>

            {/* Featured Stories from MongoDB */}
            <section className="px-6 md:px-16 py-16 bg-[#eeeae1]">
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <div>
                        <p className="text-orange-600 uppercase tracking-widest text-sm font-semibold">
                            Editor's Corner
                        </p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">
                            Latest Stories
                        </h2>
                    </div>

                    <button
                        onClick={() => navigate("/blogs")}
                        className="underline underline-offset-4"
                    >
                        View all stories →
                    </button>
                </div>

                {loading ? (
                    <p className="text-center py-12 text-gray-600">
                        Loading latest stories...
                    </p>
                ) : error ? (
                    <p className="text-center py-12 text-red-600">
                        {error}
                    </p>
                ) : latestBlogs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-serif font-bold">
                            No stories published yet.
                        </h3>
                        <p className="text-gray-600 mt-3">
                            Visit the Admin Dashboard to publish your first blog!
                        </p>
                        <button
                            onClick={() => navigate("/admin")}
                            className="mt-6 bg-[#25231f] text-white px-7 py-3 rounded-full hover:bg-orange-600 transition"
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {latestBlogs.map((blog, index) => (
                            <article
                                key={blog._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                            >
                                <img
                                    src={blogImages[index]}
                                    alt="Blog story"
                                    className="w-full h-72 object-cover"
                                />

                                <div className="p-7">
                                    <p className="text-orange-600 text-sm font-semibold uppercase tracking-widest">
                                        InkSphere · Latest Story
                                    </p>

                                    <h3 className="text-3xl font-serif font-bold my-4">
                                        {blog.newTitle}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {blog.newContent.length > 180
                                            ? blog.newContent.substring(0, 180) + "..."
                                            : blog.newContent}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-4">
                                        Published: {formatDate(blog.date)}
                                    </p>

                                    <button
                                        onClick={() => navigate("/blogs")}
                                        className="mt-6 font-semibold hover:text-orange-600"
                                    >
                                        Read More →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Categories */}
            <section className="px-6 md:px-16 py-20">
                <p className="text-orange-600 uppercase tracking-widest text-sm font-semibold">
                    Explore by interest
                </p>

                <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-10">
                    A World of Perspectives
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            onClick={() => navigate("/blogs")}
                            className="text-left bg-white border border-gray-200 rounded-xl p-7 hover:border-orange-500 hover:-translate-y-1 transition"
                        >
                            <span className="text-orange-600 text-sm">
                                0{index + 1}
                            </span>
                            <h3 className="text-xl font-serif font-bold mt-4">
                                {category}
                            </h3>
                            <p className="text-gray-500 text-sm mt-3">
                                Discover ideas and stories →
                            </p>
                        </button>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                className="px-6 md:px-16 py-20 bg-[#25231f] text-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <p className="uppercase tracking-[4px] text-orange-400 text-sm">
                        About InkSphere
                    </p>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold mt-6">
                        More Than Just Words.
                        <span className="block text-orange-400 italic">
                            It's a Space to Connect.
                        </span>
                    </h2>

                    <p className="text-gray-300 text-lg leading-relaxed mt-7">
                        InkSphere was created to celebrate the power
                        of ideas and storytelling. It is a place where
                        knowledge meets creativity, and every voice
                        has a story worth sharing.
                    </p>

                    <button
                        onClick={() => navigate("/blogs")}
                        className="mt-9 bg-orange-500 px-8 py-4 rounded-full hover:bg-orange-600 transition"
                    >
                        Start Exploring →
                    </button>
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-6 py-20 text-center">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">
                    Every Story Starts Somewhere.
                </h2>

                <p className="text-gray-600 mt-5">
                    Your next favourite read might be just one click away.
                </p>

                <button
                    onClick={() => navigate("/blogs")}
                    className="mt-8 bg-[#25231f] text-white px-9 py-4 rounded-full hover:bg-orange-600 transition"
                >
                    Read the Latest Blogs
                </button>
            </section>

            <Footer />
        </div>
    );
}

export default Home;