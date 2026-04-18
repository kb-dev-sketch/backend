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
export {registerUser}  