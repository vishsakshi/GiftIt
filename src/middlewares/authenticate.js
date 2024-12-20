require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};
const authenticate = async (req, res, next) => {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return res.status(200).redirect('/register/login');
  let token = cookieHeader.split("=")[1];
  // console.log("Extracted Token:", token);
  console.log("CookieHeader", cookieHeader)
  let user;
  try {
    user = await verifyToken(token);
    console.log("User", user);
  } catch (error) {
    return res.status(500).send({ message: "Authorization token invalid" });
  }
  //   console.log(user)
  req.user = user.user;
  //   console.log(req.user);

  //   console.log('user:', req.user);
  return next();
};

module.exports = { authenticate, verifyToken };
