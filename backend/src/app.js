import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors(
{    origin: 'http://localhost:52958' ,   //frontend ki port dlni
    credentials: true 
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb", extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

//import router
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/user", userRouter)



export {app}