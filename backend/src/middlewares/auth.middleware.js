import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  next();
});

export default protectedRoute;
