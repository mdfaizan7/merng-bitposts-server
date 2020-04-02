const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = context => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        return jwt.verify(token, SECRET_KEY);
      } catch {
        err;
      }
      {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error(
      "Authorization token in the correct format: 'Bearer [token]'"
    );
  }
  throw new Error("Authorization token must be provided");
};
