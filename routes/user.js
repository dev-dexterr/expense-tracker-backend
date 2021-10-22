import express from "express"
import { upsertUser, deleteUser } from "../controllers/UserController";

const router = express.Router();

//Add User / Edit User
router.post("/upsert", (req,res)=> upsertUser(req,res))
//Delete User 
router.delete("/delete/:id", (req,res)=> deleteUser(req,res))

export default router;
