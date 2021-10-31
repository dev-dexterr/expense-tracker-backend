import mongoose from "mongoose";

const UserProfileSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// UserProfileSchema.methods.fillUserInfo = (obj) => {
//   return{

//   }
// }

UserProfileSchema.methods.payload = async(obj) => {
  return{
    login: obj._id,
    username: obj.username,
    email: obj.email,
  }
}

export default mongoose.model("UserProfile", UserProfileSchema);
