import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());

import employeeRouter from "./routes/employeeRouter.js";
import userRouter from "./routes/userRouter.js";

app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/user", userRouter);

export default app;
