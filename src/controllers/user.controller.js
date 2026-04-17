import { asyncHandler } from "../utils/asyncHandler.js"; 
const registerUser=asyncHandler(async(req,res)=>{
res.statu(200).json({
    message:"ok"
})
})
export {registerUser} 