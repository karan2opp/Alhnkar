import * as orderService from "./orderServices.js"
import ApiResponse from "../../common/utils/apiResponse.js"

export const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body)
  ApiResponse.created(res, "Order placed successfully", order)
}

export const cancelOrder = async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user.id)
  ApiResponse.ok(res, "Order cancelled successfully", order)
}

export const updateOrder = async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body)
  ApiResponse.ok(res, "Order updated successfully", order)
}
export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id)
  ApiResponse.ok(res, "Order fetched successfully", order)
}

export const getAllOrders = async (req, res) => {
  const orders = await orderService.getAllOrders(req.user.id)
  ApiResponse.ok(res, "Orders fetched successfully", orders)
}

export const getAllOrdersAdmin = async (req, res) => {
  const { orders, hasMore } = await orderService.getAllOrdersAdmin(req.query)
  ApiResponse.ok(res, "Orders fetched successfully", { orders, hasMore })
}