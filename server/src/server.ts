import app from "./app";
import connectDB from "./utils/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5080;

//connect to database
// Connect to the database
connectDB()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
