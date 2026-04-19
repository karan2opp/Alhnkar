import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import authRoute from "./src/module/auth/authRoutes.js"
import productRoute from "./src/module/product/productRoutes.js"
import categoryRoute from "./src/module/category/categoryRoutes.js"
import addressRoute from "./src/module/address/addressRoutes.js"
import orderRoute from "./src/module/orders/orderRoutes.js"
import cartRoute from "./src/module/cart/cartRoutes.js"
import reviewRoute from "./src/module/review/reviewRoutes.js"
import cors from "cors"

const app=express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true, // allow cookies / auth tokens
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products",productRoute)
app.use("/api/categories",categoryRoute)
app.use("/api/address",addressRoute)
app.use("/api/orders",orderRoute)
app.use("/api/cart",cartRoute)
app.use("/api/review",reviewRoute)
app.use((err, req, res, next) => {
  console.log(err);
  
  res.status(500).json({ message: err.message });

});
export default app;