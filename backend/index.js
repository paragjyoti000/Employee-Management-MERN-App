import "dotenv/config";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`🌐 Server listening on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection FAILED !!", err);
    });
