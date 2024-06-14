import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({
    limit:"16kb",
    extended: true
}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js'
import bookRouter from './routes/books.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/books", bookRouter)



export {app} 