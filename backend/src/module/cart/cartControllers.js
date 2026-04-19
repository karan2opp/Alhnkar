import ApiResponse from "../../common/utils/apiResponse.js"
import * as cartService from "./cartServices.js"

export const addToCart=async(req,res)=>{


  const result=await cartService.addToCart(req.body,req.user.id)
  ApiResponse.ok(res,"Item added to cart succesfully",result);
}

export const updateCart=async(req,res)=>{
    const result=await cartService.updateCart(req.body,req.user.id)
    ApiResponse.ok(res,`${req.body.action} item  succesfully`,result);
}
export const fetchCart = async (req, res) => {

  
  const cart = await cartService.fetchCart(req.user.id)
  ApiResponse.ok(res, "Cart fetched successfully", cart)
}