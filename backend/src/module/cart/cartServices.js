import Cart from "./cartModels.js"
import User from "../auth/authModels.js"
import ApiError from "../../common/utils/apiError.js"
import Product from "../product/productModels.js"

export const addToCart=async(productInfo,userId)=>{

    const {productId,size,quantity}=productInfo
    
  const product=await Product.findById(productId)

  
 if(!product)throw ApiError.notfound("Product not found")
    
 let cart = await Cart.findOne({ user: userId });
  if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product, size, quantity }],
      });

      await cart.save();

      return cart.toObject()
    }
     const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === product &&
        item.size === size
    );

    if (itemIndex > -1) {
      
      cart.items[itemIndex].quantity += quantity;
    } else {
      
      cart.items.push({ product, size, quantity });
    }

    await cart.save();
    return cart.toObject()

} 

export const updateCart=async(productInfo,userId)=>{
    const {productId,action,size}=productInfo
    const product=await Product.findById(productId)
 if(!product)throw ApiError.notfound("Product not found")
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw ApiError.notfound("Cart not found");
      
    }
    
    
   const itemIndex = cart.items.findIndex(
  (item) =>
    item.product.toString() === productId &&
    item.size === size
);



if (itemIndex === -1) {
  throw ApiError.notfound("Product not found")
}


 if (action === "increment") {
   
    
      cart.items[itemIndex].quantity += 1;

    } else if (action === "decrement") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }

    } else if (action === "remove") {
      cart.items.splice(itemIndex, 1);

    }
     await cart.save();

   
    return cart
}


export const fetchCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "title images price isActive")

  if (!cart) return { items: [], total: 0 }

  // filter out inactive products
  const activeItems = cart.items.filter(item => item.product?.isActive)

  const total = activeItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity, 0
  )

  return { items: activeItems, total }
}