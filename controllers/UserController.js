import jwt from "jsonwebtoken";
import UserProfile from "../models/User.js";
import { validatePwd, hashPwd } from "../utils/middleware.js"

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
        res.status(200).json({ datas: data });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }

//Login 
export async function login(req, res){
    const user = await UserProfile.findOne({username: req.body.username});

    if(user != null){
        const checkedPwd = await validatePwd(req.body.password, user.password)
        user.save();
        const result = await user.payload(user);

        if(checkedPwd){
            jwt.sign({data: await user.payload(user)}, process.env.TOKEN_SECRET, {expiresIn: '7d'}, (err, token) => {
                result.token = token;
                return res.status(200).json({data: result});
            });
        }
        else{
            res.status(200).json({message: "Invalid username or password"});
        }
    }
    else{
        res.status(500).json({message: "Invalid username or password"});
    }
}

