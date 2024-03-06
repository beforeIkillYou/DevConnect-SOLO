import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   

const app = express();


app.use(cors({
    orgin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(cookieParser());

//ROUTES FROM HERE
//importing routes
import userRouter from './routes/user.router.js'
import postRouter from './routes/post.router.js'
import commentRouter from './routes/comment.router.js'

//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/comments",commentRouter)

export { app }