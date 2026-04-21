import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../models/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// make method for generate and access token
const generateAccessAndRefershTokens=async(userId)=>{
     try{
 const user=await User.findById(userId)
  const accessToken=user.generateAccessToken()
 const refreshToken=user.generateRefreshToken()
 user.refreshToken=refreshToken
 await user.save({validBeforeSave:false})
 return {accessToken,refreshToken}

     }
     catch(error){
          throw new ApiError(500,"Something went wrong while generating refresh and access token ")
     }
}

const registerUser=asyncHandler(async(req,res)=>{
// get user details from frontend
// validation -not empty
// check if user alreadt exist 
// check for avatar ,Image
// upload them in cloudinary,avatar
//user object -create entry in db 
// remove password and refresh token field from response
// check for user creation 
// return response

     const {fullname,email,username,password}=req.body
     console.log("email:",email);
     console.log("password:",password);

if (!fullname || !email || !username || !password) {
    console.log({ fullname, email, username, password });
    throw new ApiError(400, "All fields are required");
}
   const existedUser= await User.findOne({$or:[{username},{email}]})
   if(existedUser){
     throw new ApiError(409,"username  or email is already existed")
   }
   console.log(req.files);

   const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath= req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
     throw new ApiError(400,"Avatar local file is required")
  }
  const avatar=await uploadOnCloudinary (avatarLocalPath)
 const coverImage= await uploadOnCloudinary(coverImageLocalPath)

if (!avatar){
     throw new ApiError(400,"Avatar clodinary  file  is required")
}


const user= await User.create({
     fullname,
     avatar:avatar.secure_url,
     coverImage:coverImage?.secure_url || "",
     email,
     password,
     username:username.toLowerCase()
})
const createduser=await User.findById(user._id).select(
     "-password -refreshToken"
)
if(!createduser){
     throw new ApiError(500,"something went wrong when user registring")
}

return res.status(201).json(
     new ApiResponse(200,createduser,"user registered successfully")
)
})

const loginUser=asyncHandler(async(req,res)=>{
     // req ->body
     // username or email
     // find the user
     //password check
     // access and refresh token 
     //send cookies

     const {email,username,password}=req.body
     
     if(!username || !email ) {
          throw new ApiError(400,"username or email is required")
     }
    const user= await User.findOne({
          $or:[{username},{email}]
     })
     if(!user){
          throw new ApiError(404,"User does not exist")
     }
     const isPasswordValid=await user.isPasswordCorrect(password)
     if(!isPasswordValid){
         throw new ApiError(404,"invalid credentials")
     }
     const {accessToken,refreshToken}=await
     generateAccessAndRefershTokens(user._id)
 const loggedInUser=   User.findById(user._id).select("-password -refreshToken")
     // send to cookies
const options={
     httpOnly:true,
     secure:true
}
 return  res.status(200).
 cookie("accessToken",accessToken,options)
 .cookie('refreshToken',refreshToken,options)
 .json (
     new ApiResponse(
          200,
          {
               user:loggedInUser,accessToken,refreshToken
          },
          "User logged In Successsfull"
     )
 )
})
export {registerUser}  