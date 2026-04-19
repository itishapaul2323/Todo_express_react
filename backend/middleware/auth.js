const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function authToken(req, res, next) {
  const token = req.headers.token;

  if (!SECRET) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (!token) {
    return res.status(403).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.username = decoded.username;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = {
  authToken,
};
