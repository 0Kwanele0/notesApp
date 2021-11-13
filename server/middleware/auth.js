const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
  const publicUrls = [{ url: "/api/user", method: "POST" }];
  let isPublic = false;

  for (let i = 0; i < publicUrls.length; i++) {
    const { url, method } = publicUrls[i];
    if (req.url.includes(url) && req.method === method) {
      isPublic = true;
      break;
    }
  }

  if (isPublic) {
    next();
    return;
  }

  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({ msg: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(JSON.parse(token), process.env.SECRETE);
    req.id = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = auth;
