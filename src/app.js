import express from "express";
const app = express();
import cors  from "cors";
import cookieParser from "cookie-parser";

 app.use(cors({
     origin: process.env.CORS_ORIGION ,
     credentials: true
 }))

 app.use(express.json({}))
 app.use(express.urlencoded({extended: true, limit: "16kb"})) 
 app.use(express.static("public"))
 app.use(cookieParser())

 // import routes
 import userRouter from "./routes/user.routes.js"

 // routes declaration
 app.use("/api/v1/users",userRouter)

export{app};