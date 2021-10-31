import express from "express";
import {
  editUser,
  deleteUser,
  listUser,
  getUserInfo,
} from "../controllers/UserController.js";

const router = express.Router();

//List User
router.post("/list", (req, res) => listUser(req, res));

//Edit User
router.post("/edit", (req, res) => editUser(req, res));

//Delete User
router.delete("/delete/:id", (req, res) => deleteUser(req, res));

//Info
router.get("/info", (req, res) => getUserInfo(req, res));
export default router;
