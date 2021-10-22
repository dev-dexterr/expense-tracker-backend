import jwt from "jsonwebtoken";
import UserProfile from "../models/User.js";
import { validatePwd, hashPwd } from "../utils/middleware.js";
import * as msg from "../utils/message.js";
import { meta } from "../utils/enum.js";

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
      res.status(200).json({ meta: meta.OK,datas: data });
    })
    .catch((err) => {
      res.status(500).json({ meta: meta.ERROR,message: err.message });
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
          return res.status(200).json({ meta: meta.OK , data: result });
        }
      );
    } else {
      res.status(200).json({ message: msg.errorMsg.not_username_pwd });
    }
  } else {
    res.status(500).json({ message: msg.errorMsg.not_username_pwd });
  }
}

export async function upsertUser(req, res) {
  try {
    if (req.body.id === undefined || req.body.id == "") {
      delete req.body.id;

      const user = new UserProfile(req.body);
      user
        .save()
        .then((data) => {
          res
            .status(200)
            .json({ meta: meta.OK, message: msg.generalMsg.record_add });
        })
        .catch((err) => {
          res.status(404).json({ meta: meta.ERROR, message: err.message });
        });
    } else {
      await UserProfile.findByIdAndUpdate(
        { _id: req.body.id },
        req.body,
        (err, data) => {
          if (err) {
            res.status(404).json({ meta: meta.ERROR, message: err.message });
            return true;
          }

          if (data != null) {
            res
              .status(200)
              .json({ meta: meta.OK, message: msg.generalMsg.record_update });
          } else {
            res.status(404).json({
              meta: meta.NOTEXIST,
              message: msg.generalMsg.record_notexist,
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(404).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    UserProfile.findByIdAndDelete(req.params.id, (err, data) => {
      if (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
        return true;
      }

      if (data != null) {
        res
          .status(200)
          .json({ meta: meta.OK, message: msg.generalMsg.record_delete });
      } else {
        res
          .status(404)
          .json({
            meta: meta.NOTEXIST,
            message: msg.generalMsg.record_notexist,
          });
      }
    });
  } catch (err) {
    res.status(404).json({ meta: meta.ERROR, message: err.message });
  }
}

// export async function resetPwd(req,res){
//   try{
//     if(!req.body.id){
//       res.status(200).json({meta:meta.ERROR, message: msg.errorMsg.id_require})
//     }

//     UserProfile.findOneAndUpdate({username: req.body.username , password: req.body.password})
//   }catch(err){
//       res.status(400).json({meta: meta.ERROR, message: err.message})
//   }
// }
