const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Post = require("./models/Post");
const fs = require("fs");
require("dotenv").config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
const User = require("./models/User");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const uploadMiddleware = multer({ dest: "uploads/" });
app.use("/uploads", express.static(__dirname + "/uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app password or email password
  },
});

app.post("/register", async (req, res) => {
  console.log(req.body); // Log the request body to ensure it's being received correctly

  const { name, password } = req.body;

  try {
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const userDoc = await User.create({
      name,
      password: hashedPassword,
    });

    // Prepare and send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New User Registration",
      html: `<h1>New User Registration</h1>
                   <p>A new user has registered with the following details:</p>
                   <ul>
                     <li><strong>Name:</strong> ${name}</li>
                     <li><strong>Password:</strong> [REDACTED]</li>
                   </ul>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json(userDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const userDoc = await User.findOne({ name });

    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the passwords
    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (isMatch) {
      jwt.sign(
        { name, id: userDoc._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            name,
            id: userDoc._id,
          });
        }
      );
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) return res.status(400).json({ message: "Unauthorized" });
    res.json(user);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
    if (err) return res.status(400).json({ message: "Unauthorized" });
    const { title, summary, content } = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: user.id,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Post.findById(id).populate("author", "name"));
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => { 
  let newPath = null;  // Initialize newPath with null
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
    if (err) return res.status(400).json({ message: "Unauthorized" });
    
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(user.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author of this post');
    }

    // Update the post with the new data
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover, // Use newPath if a new file is uploaded, otherwise keep the old cover
    });

    res.json(postDoc); // Send updated post as response
  });
});


app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
