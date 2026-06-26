import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
{
name: "Matte Velvet Lipstick",
price: 799,
brand: "SUIIS",
category: "Lips",
image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
description: "Luxury long-lasting matte lipstick"
},
{
name: "Glossy Shine Lip Gloss",
price: 699,
brand: "SUIIS",
category: "Lips",
image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
description: "High shine lip gloss for smooth lips"
},
{
name: "Liquid Foundation Pro",
price: 1299,
brand: "SUIIS",
category: "Face",
image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
description: "Full coverage professional foundation"
},
{
name: "Glow Highlighter",
price: 899,
brand: "SUIIS",
category: "Face",
image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74",
description: "Radiant glow highlighter"
},
{
name: "Smokey Eye Palette",
price: 1499,
brand: "SUIIS",
category: "Eyes",
image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
description: "Professional smokey eye palette"
},
{
name: "Waterproof Mascara",
price: 799,
brand: "SUIIS",
category: "Eyes",
image: "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3",
description: "Long lasting waterproof mascara"
},
{
name: "Soft Blush Powder",
price: 699,
brand: "SUIIS",
category: "Face",
image: "https://images.unsplash.com/photo-1590156117763-d6a9f9e2f7ae",
description: "Natural soft blush powder"
},
{
name: "Luxury Makeup Brush Set",
price: 1999,
brand: "SUIIS",
category: "Accessories",
image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
description: "Professional makeup brush set"
},
{
name: "Hydrating Primer",
price: 899,
brand: "SUIIS",
category: "Face",
image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",
description: "Smooth hydrating makeup primer"
},
{
name: "Setting Spray Pro",
price: 999,
brand: "SUIIS",
category: "Face",
image: "https://images.unsplash.com/photo-1612817288484-6f916006741a",
description: "Long lasting makeup setting spray"
}
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

await Product.deleteMany();

await Product.insertMany(products);

console.log("Products Added Successfully");

process.exit();

})
.catch(err => console.log(err));