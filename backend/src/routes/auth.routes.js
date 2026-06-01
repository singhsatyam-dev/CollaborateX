import express from "express"
import { registerUser, loginUser } from "../controllers/auth.controller.js"
import protectedRoute from "../middlewares/auth.middleware.js"

const authRouter = express.Router()

authRouter.post("/register", registerUser)

authRouter.post("/login", loginUser)

authRouter.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default authRouter