const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const { userModel, todoModel } = require("./models.js");

const jwt = require("jsonwebtoken");

const { authToken } = require("./middleware/auth.js");

let app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const staticDir = path.join(__dirname, "../frontend-old");
app.use(express.static(staticDir));

const SECRET = process.env.JWT_SECRET;

app.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({ username });

    if (userExists) {
      return res.status(403).json({
        message: "user already exists, please try with a new username",
      });
    }

    await userModel.create({ username, password });
    return res.status(200).json({ message: "User Created" });
  } catch (err) {
    console.error("Signup failed:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!SECRET) {
      console.error("JWT_SECRET is not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const userExists = await userModel.findOne({ username, password });

    if (!userExists) {
      return res.status(403).json({ message: "No such user Exists" });
    }

    const token = jwt.sign(
      {
        username,
      },
      SECRET,
    );

    return res
      .status(200)
      .json({ message: "SuccessFully Logged In ", token: token });
  } catch (err) {
    console.error("Signin failed:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/todo", authToken, async (req, res) => {
  try {
    const todo = req.body.todo;
    const username = req.username;

    const created = await todoModel.create({ todo, username });
    return res.status(200).json({ message: "Todo Created", id: created._id });
  } catch (err) {
    console.error("Todo creation failed:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/todo", authToken, async (req, res) => {
  try {
    const username = req.username;
    if (!username) {
      return res.status(403).json({ message: "Please signin again " });
    }

    const todosList = await todoModel.find({ username });
    return res.status(200).json({ todosList });
  } catch (err) {
    console.error("Fetching todos failed:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/todo", authToken, async (req, res) => {
  try {
    const username = req.username;
    const id = req.body.id;

    if (!username) {
      return res.status(403).json({ message: "Please signin again" });
    }

    await todoModel.deleteOne({ _id: id, username });
    return res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Deleting todo failed:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
