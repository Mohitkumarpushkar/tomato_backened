import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);  // Debugging line
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    // frontend url
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
           
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "delivery charge"
                },
                unit_amount: 200 * 80
            },
            quantity: 1
        });

        console.log("Creating Stripe session with line items:", line_items);

        try {
      
            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: "payment",
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            });

            console.log("Stripe session created successfully:", session);

            res.json({ success: true, session_url: session.url });
        } catch (stripeError) {
            console.error("Error creating Stripe session:", stripeError);
            res.json({ success: false, message: "Error creating payment session" });
        }

    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};


const verifyOrder= async ()=>{
    const {orderId,success}=req.body;
    try{
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"not paid"})
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error verifying order"})
    }

}

//user orders for frontend
const userOrders=async (req,res)=>{
    try{

        let orders=await orderModel.find({userId:req.body.userId});
        res.json({ success: true, data:orders})
    }
    catch(error){
        console.log(error);
        res.json({ success: false, message: "Error"});
    }
 }


// Listing orders for admin panel
const listOrders=async (req,res)=>{
    try{
        const orders=await orderModel.find({});
        res.json({success:true,data:orders});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
   

}

//api for updating order status
const updateStatus=async(req,res)=>{
    try {
        
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.json({ success: false, message: "Error updating order status" });
        
    }

}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};