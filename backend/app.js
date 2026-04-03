import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import authRoute from "./src/module/auth/authRoutes.js"
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
export default app;