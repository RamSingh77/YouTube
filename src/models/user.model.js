import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true, // index base searching
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     avatar: {
//       type: String, // cloudnary url
//       required: true,
//     },
//     coverImage: {
//       type: String, // cloudnary url
//     },
//     watchHistory: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Video",
//       },
//     ],
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   { timestamps: true } // for created at and updated at
// );



const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
      minlength: [3, "Full name must be at least 3 characters long"],
    },

    avatar: {
      type: String,
      required: [true, "Avatar URL is required"],
      match: [
        /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg)$/,
        "Avatar must be a valid image URL",
      ],
    },

    coverImage: {
      type: String,
      match: [
        /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg)$/,
        "Cover image must be a valid image URL",
      ],
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
      minlength: [6, "Password must be at least 6 characters long"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);



 userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();
        const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password ,salt)
      next();
 })

 userSchema.methods.isPasswordCorrect = async function(password){
    return  await bcrypt.compare(password , this.password)  // userpassword comapre to databsehash password
 };


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
