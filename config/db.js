

import mongoose from "mongoose";


export   const connectDB= async() => {
    await mongoose.connect('mongodb+srv://mohitkumar:Asdf900@cluster0.ztmt45b.mongodb.net/food-del?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("connection established"))
}

