import dotenv from "dotenv"
import  {connectDb} from "./config/database.config.js"
import app from "./app.js"
dotenv.config()






async function startServer() {
    await connectDb()
    app.listen(process.env.PORT)
    console.log("Server is Start..")
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


startServer()