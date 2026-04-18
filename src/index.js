import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
  path:'./.env'
})
import app from "./app.js";

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
  })
  
})
.catch((error)=>{
  console.log("mongo db connection failed !!",error);
})


/*
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("err:", error);
      throw error;
    });

    const PORT = process.env.PORT || 2000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.log("ERROR:", error);
  }
})();
*/