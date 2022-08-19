const jwt = require("jsonwebtoken");

const generateUserToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "48h",
  });
};

module.exports = generateUserToken;
