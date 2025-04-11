 import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { validateRegistrationInput } from "../utils/validateRegistration.js";

// generate a method for accesstoken and refereshtoken

const generateAccessAndRefereshTokens = async(userId)=>{
    try {
       // we find user document
       const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
     await user.save({ validateBeforeSave: false })
     return {accessToken, refreshToken}
    } catch (error) {
      throw new ApiError(500, "Something went wrong  while generating access and referesh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, } = req.body;
  // console.log("Request body", req.body);
  console.log("req.files:", req.files);

  // ✅ Check for empty fields
  if ([fullName, email, username, password,].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // ✅ Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // ✅ Access uploaded file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Avatar upload failed");
  }



  // const { fullName, email, password, username } = req.body;
  // console.log("Req.body", req.body);

  // const errors = validateRegistrationInput({
  //   fullName,
  //   email,
  //   password,
  //   username,
  // });

  // if (errors.length > 0) {
  //   return res.status(400).json({ success: false, errors });
  // }
  // // Acces upload file path
  // const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }
  // // upload cloudinary

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = coverImageLocalPath
  //   ? await uploadOnCloudinary(coverImageLocalPath)
  //   : null;

  // if (!avatar || !avatar.url) {
  //   throw new ApiError(400, "Avatar upload failed");
  // }

  // ✅ Create user in DB
  
  
  
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // ✅ Respond with success
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


// User login
const loginUser = asyncHandler(async(req , res) => {
   const {username , email , password,} = req.body;
    
   if(!email || !username){
      throw new ApiError(400, "username or email is required to login")
   }
   // find user or email is required in our database
  const user = await User.findOne({
      $or: [{username}, {email}]
   });

   if(!user){
     throw new ApiError(404 , "user does  not exist in our database")
   }
  const isPasswordValid =  await user.isPasswordCorrect(password)

  if(!isPasswordValid){
     throw new ApiError(401 , "Invalid user credentials")
  }

  const{accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
       secure: true
  }
  
  return res.status(200)
  .cookie("accessToken", accessToken ,options)
  .cookie("refreshToken", refreshToken, options)
  .json(
     new ApiResponse(
       200,
      {
        user: loggedInUser,accessToken,refreshToken
      },
      "User logged In Successfully"
     )
  )

})

// logout user

const logoutUser = asyncHandler(async(req , res)=> {
     await User.findByIdAndUpdate(
       req.user._id,
       {
            $set: {
                refreshToken: undefined
            }
       },

       {
          new: true
       }
    )
    

    
  const options = {
    httpOnly: true,
     secure: true
  }
   return res
   .status(200)
   .clearCookies("accessToken",options) 
   .clearCookies("refreshToken",options)
   .json(new ApiResponse(200, {}, " User logged out"))
})

export { 
  registerUser,
  loginUser,
  logoutUser
};
