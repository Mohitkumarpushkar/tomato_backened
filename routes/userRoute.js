import express from 'express';
import { loginUser,resisterUser } from '../controller/userController.js';

const userRouter=express.Router();

userRouter.post('/register',resisterUser);
userRouter.post('/login',loginUser);


export default userRouter;