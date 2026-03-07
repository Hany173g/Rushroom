import express from "express"
import passport  from "passport";
import authRoute from "./routes/user/auth.route.js"
import errorHandling from "./contoller/error.contoller.js"
import dotenv from "dotenv"
import isUser from "./middlewares/isUser.middleware.js"
import cors from "cors"
import corsOptions from "./middlewares/cors.middleware.js"
import profileRoute from "./routes/user/profile.route.js"
const app = express()

dotenv.config()

// import a config google stratgey
import "./auth/auth.google.js"


// Middlewares 

    // initialize passport
app.use(passport.initialize());
app.use(express.json())



    // cors options
app.use(cors(corsOptions))    

    // to check status user (login or guest)
app.use(isUser) 
// Routes

        // User
app.use("/auth", authRoute)
app.use("/user" , profileRoute)





//Error Handling Middleware

app.use(errorHandling)


export default app