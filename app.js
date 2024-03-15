import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useRouter from "./routes/userRouter.js";
import articalRouter from "./routes/articalRouter.js";
import socialmediaRouter from "./routes/socialmediaRouter.js";
import dbConnection from "./database/dbconnection.js";
import ErrorHandler from './middlewares/error.js';
import errorMiddleware from './middlewares/error.js';
import fileUpload from 'express-fileupload';
const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config({ path: "./config/config.env "});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
console.log(process.env.FRONTEND_URL);

 app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
//     // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/",
}));

app.use("/api/v1/user", useRouter);
app.use("/api/v2/artical", articalRouter);

app.use("/api/v3/socialmedia", socialmediaRouter);



dbConnection();
app.use(ErrorHandler);
app.use(errorMiddleware);
 
 //Connect to the database before listening
// dbConnection().then(() => {
//     app.listen(PORT, () => {
//         console.log("listening for requests");
//     })
// })


export default app;
