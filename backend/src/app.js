import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import documentRouter from "./routes/document.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api Running...");
});

app.get("/error", (req, res) => {
  throw new Error("Test error");
});

app.use("/api/auth", authRouter);
app.use("/api/documents", documentRouter);

app.use(errorMiddleware);

export default app;
