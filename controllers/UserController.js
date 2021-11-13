import jwt from "jsonwebtoken";
import UserProfile from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { validatePwd, hashPwd } from "../utils/middleware.js";
import * as msg from "../utils/message.js";
import { meta } from "../utils/enum.js";


export async function listUser(req, res) {
  try {
    const user = await UserProfile.find();
    res.status(200).json({ meta: meta.OK, datas: user })
  } catch (err) {
    res.status(400).json({ meta: meta.ERROR, message: err.message })
  }
}

//Register
export async function register(req, res) {
  const user = new UserProfile({
    username: req.body.username,
    email: req.body.email,
    password: await hashPwd(req.body.password),
  });
  user
    .save()
    .then((data) => {
      res.status(200).json({ meta: meta.OK, datas: data });
    })
    .catch((err) => {
      res.status(500).json({ meta: meta.ERROR, message: err.message });
    });
}

//Login
export async function login(req, res) {
  const user = await UserProfile.findOne({ username: req.body.username });

  if (user != null) {
    const checkedPwd = await validatePwd(req.body.password, user.password);
    user.save();
    const result = await user.payload(user);

    if (checkedPwd) {
      jwt.sign(
        { data: await user.payload(user) },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" },
        (err, token) => {
          result.token = token;
          return res.status(200).json({ meta: meta.OK, data: result });
        }
      );
    } else {
      res.status(200).json({ message: msg.errorMsg.not_username_pwd });
    }
  } else {
    res.status(500).json({ message: msg.errorMsg.not_username_pwd });
  }
}

export async function editUser(req, res) {
  try {
    if(!req.body.userprofile){
      res.status(200).json({meta:meta.ERROR, message: msg.errorMsg.id_require})
    }
    await UserProfile.updateOne({ _id: req.body.userprofile },{username: req.body.username , email: req.body.email})
    res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_update });
  } catch (err) {
    res.status(400).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    await UserProfile.remove({ _id: req.params.id });
    res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_delete });
  } catch (err) {
    res.status(404).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function resetPwd(req,res){
  try{
    const user = await UserProfile.findOne({ _id: req.body.userprofile });
    if(!req.body.userprofile){
      res.status(200).json({meta:meta.ERROR, message: msg.errorMsg.id_require})
    }

    if(req.body.newPassword != req.body.confirmPassword){
      res.status(200).json({meta: meta.ERROR, message: msg.errorMsg.pwdNotMatch})
    }

    if(user != null){
      const checkedPwd = await validatePwd(req.body.oldPassword, user.password);
      if(checkedPwd){
        await UserProfile.updateOne({ _id: req.body.userprofile },{ password: await hashPwd(req.body.newPassword) })
        res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_update });
      }else{
        res.status(200).json({meta: meta.ERROR, message: msg.errorMsg.wrongpwd})
      }
    }else{
        res.status(200).json({meta: meta.ERROR, message: msg.errorMsg.user_not_found})
    }
  }catch(err){
      res.status(400).json({meta: meta.ERROR, message: err.message})
  }
}

export async function getUserInfo(req,res){
  try{
    const user = req.user
    let transaction = await Transaction.find({userprofile: user.login})
    user.transaction = transaction;
    res.status(200).json({meta: meta.OK , user_info: user});
  }catch(err){
    res.status(400).json({meta: meta.ERROR, message: err.message});
  }
}
