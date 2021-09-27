import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {verifyToken} from "./utils/middleware.js"

//Routes
import loginRoute from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

const startServer = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connection Connected Successfully!!");
    })
    .catch((err) => {
      console.log(err);
    });

  app.use(express.json());
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
  });

  app.use("/", loginRoute);

  app.listen(port, () => {
    console.log(`Backend Server is Running at http://localhost:${port}`);
  });
};

startServer();
