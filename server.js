
import userRouter from './routes/userRoute.js';
import express from 'express'
import cors from 'cors'
import foodRouter from './routes/foodRoutes.js'

import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoutes.js';
import dotenv from 'dotenv';
dotenv.config();






import { connectDB } from './config/db.js';




const app = express();


//middleware
app.use(express.json());
app.use(cors())

//db connection
connectDB();


//api endpoints
app.use('/api/food',foodRouter)
app.use('/images',express.static('uploads'))
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);

app.use('/api/order',orderRouter);










app.get('/', (req, res) => {
    res.send("api working")


})



app.listen(process.env.PORT,()=>{
   
    console.log(`server running at http://localhost:${process.env.PORT}`)
 })

