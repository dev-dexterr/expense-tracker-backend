import express from "express"
import {listTransaction, getTransaction , addTransaction , editTransaction , deleteTransaction} from "../controllers/TransactionController.js";

const router = express.Router();

router.post("/list", (req, res) => listTransaction(req,res));

router.get("/:id", (req, res)=> getTransaction(req,res));

router.post("/add",(req,res)=> addTransaction(req,res));

router.post("/edit",(req,res)=> editTransaction(req,res));

router.delete("/delete/:id", (req,res)=> deleteTransaction(req,res));

export default router;