import app from "./app";
import connectDB from "./utils/db";
import dotenv from "dotenv";

const PORT = process.env.PORT || 5080;

//connect to database
connectDB();
dotenv.config();

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
