import express from "express";
import Razorpay from "razorpay";



const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_KEY",
  key_secret: "YOUR_SECRET"
});

router.post("/create-order", async (req,res)=>{

  const options = {
    amount: req.body.amount * 100,
    currency: "INR"
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});

export default router;