
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

// Firebase Admin SDK configuration
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require("./config/serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount)
});

// Create Express app BEFORE using app.use()
const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        process.env.FRONTEND_URL
    ].filter(Boolean)
}));

app.use(express.json());

// MongoDB Blog Schema
const blogSchema = new mongoose.Schema({
    newTitle: {
        type: String,
        required: true,
        trim: true
    },
    newContent: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: () => new Date().toISOString()
    },
    likes: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

// Firebase token verification
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await getAuth().verifyIdToken(token);

        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
};

// Admin authorization
const verifyAdmin = (req, res, next) => {
    if (!process.env.ADMIN_UID) {
        return res.status(503).json({
            message: "Admin access has not been configured."
        });
    }

    if (req.user.uid !== process.env.ADMIN_UID) {
        return res.status(403).json({
            message: "Access denied. Admin permission required."
        });
    }

    next();
};

// Check admin access
app.get("/api/admin/check", verifyFirebaseToken, verifyAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Admin access verified!"
    });
});

// Get all blogs - Public
app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a blog - Admin only
app.post("/api/blogs", verifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const { newTitle, newContent, date, imageUrl } = req.body;

        if (!newTitle || !newContent) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        const blog = new Blog({
            newTitle,
            newContent,
            date,
            imageUrl
        });

        const newBlog = await blog.save();

        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a blog - Admin only
app.put("/api/blogs/:id", verifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const { newTitle, newContent, imageUrl } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                newTitle,
                newContent,
                imageUrl
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json(updatedBlog);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

// Delete a blog - Admin only
app.delete("/api/blogs/:id", verifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json({
            message: "Blog deleted successfully."
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Like a blog - Public
app.patch("/api/blogs/like/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json(updatedBlog);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server after MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1);
    });
