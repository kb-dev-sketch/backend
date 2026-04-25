



const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res); // ✅ don't pass next
    } catch (error) {
      next(error); // ✅ controlled usage
    }
  };
};

export { asyncHandler }
// wrapper function
 /*const asyncHandler=(requestHandler)=>{
  return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((error)=>next(error))
    }
}

export {asyncHandler};
/*

/*
export {asyncHandler}
const asyncHandler=(fn async (req,res,next)=>{
try{
await fn(req,res,next);
}
catch(error){
    res.status(error.code ||500).json({
        success:false,
        message:error.message || "Internal Server Error"
    })
}
})
*/
