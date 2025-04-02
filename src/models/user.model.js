import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // index base searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String, // cloudnary url
      required: true,
    },
    coverImage: {
      type: String, // cloudnary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true } // for created at and updated at
);
 userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password ,10)
      next();
 })

 userSchema.methods.isPasswordCorrect = async function(password){
    return  await bcrypt.hash(password , this.password)  // userpassword comapre to databsehash password
 }
 userSchema.methods.generateAccessToken = function(){
    return jwt.sign
     (
         {
              _id: this._id,
              email:this.email,
              username: this.username,
              fullName: this.fullName,
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            // object me expiray token pass
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,

         }
    )
 }


 userSchema.methods.generateRefreshToken = function(){
  return jwt.sign
  (
      {
           _id: this._id,  // some inforamtion in this token
    
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         // object me expiray token pass
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,

      }
  )
 }
export const User = mongoose.model("User", userSchema);
