import foodModel from "../models/foodModels.js";
import fs from 'fs';

const addFood= async (req,res)=>{
let image_filename=`${req.file.filename}`;
const food=new foodModel({
    name:req.body.name,
    description:req.body.description,
    price:req.body.price,
    image:image_filename,
    category:req.body.category,
})
try {
    await food.save();
    res.json({success:true,message:"food added"})
    
} catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
    
}
}

//all food list
const listFood=async (req,res)=>{
    try {
        const foods=await foodModel.find({});
        res.json({success:true,foods})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }


}

//remove food item
const removeFoodItem = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Delete the file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: "Error deleting the image file" });
            }

            // After successfully deleting the file, delete the database entry
            foodModel.findByIdAndDelete(req.body.id)
                .then(() => {
                    res.json({ success: true, message: "Food removed" });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ success: false, message: "Error deleting the food item from the database" });
                });
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


export {addFood,listFood,removeFoodItem};