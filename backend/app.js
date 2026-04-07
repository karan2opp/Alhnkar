import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import authRoute from "./src/module/auth/authRoutes.js"
import productRoute from "./src/module/product/productRoutes.js"
import categoryRoute from "./src/module/category/categoryRoutes.js"
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products",productRoute)
app.use("/api/categories",categoryRoute)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
export default app;