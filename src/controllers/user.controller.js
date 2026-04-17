import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../models/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

     const {fullName,email,username,password}=req.body
     console.log("email:",email);
     console.log("password:",password);

     if (fullName===""){
      throw new ApiError(400 ,"fullname is required")
     }
     if(email==""){
          throw new ApiError(400,"email is required")
     }
     if(username=="")
     {
          throw new ApiError (400,"username is required")
     }
     if(password==""){
          throw new ApiError (400,"password is required")
     }
   const existedUser=User.findOne({$or:[{username},{email}]})
   if(existedUser){
     throw new ApiError(409,"username  or email is already existed")
   }

   const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath= req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
     throw new ApiError(400,"Avatar file is required")
  }
  const avatar=await uploadOnCloudinary (avatarLocalPath)
 const coverImage= await uploadOnCloudinary(coverImageLocalPath)

if (!avatar){
     throw new ApiError(400,"Avatar file is required")
}

const user= await User.create({
     fullName,
     avatar:avatar.url,
     coverImage:coverImage?.url || "",
     email,
     password,
     username:username.toLowerCase
})
const createduser=await User.findById(user._id).select(
     "-password -refreshToken"
)
if(createduser){
     throw new ApiError(500,"something went wrong when user registring")
}

return res.status(201).json(
     new ApiResponse(200,createduser,"user registered successfully")
)
})
export {registerUser}  