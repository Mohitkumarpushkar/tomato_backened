import userModel from '../models/userModel.js';

const addToCart = async (req, res) => { 
    try {
      console.log("User ID:", req.body.userId);
  
      const userData = await userModel.findOne({ _id: req.body.userId });
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const cartData = userData.cartData || {};
  
      if (!cartData[req.body.itemId]) {
        cartData[req.body.itemId] = 1;
      } else {
        cartData[req.body.itemId]++;
      }
  
      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Error" });
    }
  }
  

const removeFromCart=async(req,res) => {

  try {
    console.log("User ID:", req.body.userId);

    const userData = await userModel.findOne({ _id: req.body.userId });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

   

    if(cartData[req.body.itemId]>0){
      cartData[req.body.itemId]--;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Remove from  Cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error" });
  }


  


}

const getCart=async(req,res) => {
  try{
    let userData=await userModel.findById(req.body.userId);
    let cartData=await userData.cartData;
    res.json({ success: true, cartData})
  }

  catch(error){
    console.log(error);
    res.json({ success: false, message: "Error"});
  }

}

export {addToCart,removeFromCart,getCart}