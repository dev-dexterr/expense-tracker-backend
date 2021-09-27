import { login, register } from "../controllers/UserController.js";
import express from "express"

const router = express.Router();

//Register
router.post("/register", register);
//login
router.post("/login", login)

export default router;
