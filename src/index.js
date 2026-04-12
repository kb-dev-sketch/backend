import connectDB from "./db/index.js";


connectDB();



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