import Order from "./orderModels.js"
import Product from "../product/productModels.js"
import Address from "../address/addressModels.js"
import ApiError from "../../common/utils/apiError.js"
import Shipment from "../shipment/shipmentModels.js"
import pinCodeSearch from "india-pincode-search";

export const createOrder = async (userId, data) => {
  const {
    items,
    addressId,
    deliveryAddress,
    paymentMethod
  } = data

  let address;

  // If deliveryAddress is provided directly
  if (deliveryAddress) {
    address = deliveryAddress

    // validate pincode using package
    const pincodeData = pinCodeSearch.search(address.pincode)

    if (!pincodeData || pincodeData.length === 0) {
      throw ApiError.badRequest("Invalid pincode")
    }
  }

  // Otherwise fetch address from DB
  else if (addressId) {
    const savedAddress = await Address.findOne({
      _id: addressId,
      user: userId
    })

    if (!savedAddress) {
      throw ApiError.badRequest("Address not found")
    }

    address = savedAddress
  }

  else {
    throw ApiError.badRequest("Address is required")
  }

  // validate items
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product)

      if (!product) {
        throw ApiError.badRequest("Product not found")
      }

      const variant = product.variants.find(
        v => v.size === item.size
      )

      if (!variant) {
        throw ApiError.badRequest(
          `Size ${item.size} not available`
        )
      }

      if (variant.stock < item.quantity) {
        throw ApiError.badRequest(
          `Only ${variant.stock} items left in size ${item.size}`
        )
      }

      return {
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: product.price
      }
    })
  )

  const amount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const order = await Order.create({
    user: userId,
    items: orderItems,
    amount,
    paymentMethod,
    deliveryAddress: {
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    }
  })

  return order.toObject()
}

export const updateOrder = async (orderId, data) => {
  const order = await Order.findById(orderId)
  if (!order) throw ApiError.notFound("Order not found")

  if (order.status === "cancelled") {
    throw ApiError.badRequest("Cannot update a cancelled order")
  }

  // prevent going backwards in status
  const statusFlow = ["pending", "delivered", "cancelled"]
  const currentIndex = statusFlow.indexOf(order.status)
  const newIndex = statusFlow.indexOf(data.status)

  if (newIndex < currentIndex) {
    throw ApiError.badRequest(`Cannot change status from ${order.status} to ${data.status}`)
  }

  if (data.status) order.status = data.status
  await order.save()
  return order.toObject()
}
export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId })
  if (!order) throw ApiError.notFound("Order not found")

  if (order.status === "cancelled") throw ApiError.badRequest("Order is already cancelled")

  // check shipment status
  const shipment = await Shipment.findOne({ order: orderId })
  if (shipment && shipment.status !== "pending") {
    throw ApiError.badRequest("Order cannot be cancelled once it is on the way or delivered")
  }

  order.status = "cancelled"
  await order.save()

  return order.toObject()
}

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "title images price")
  if (!order) throw ApiError.notFound("Order not found")
  return order
}

export const getAllOrders = async (userId, query) => {
  const { status } = query

  const filter = { user: userId }

  // skip filter if "allOrders" or nothing passed
  if (status && status !== "allOrders") filter.status = status

  const orders = await Order.find(filter)
    .populate("items.product", "title images price")
    .sort({ createdAt: -1 })

  return orders
}
// admin — get all orders from all users
export const getAllOrdersAdmin = async (query) => {
  const { status, page = 1, limit = 10 } = query

  const filter = {}
  if (status) filter.status = status

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product", "title images price")
    .skip((page - 1) * limit)
    .limit(Number(limit) + 1)
    .sort({ createdAt: -1 })

  const hasMore = orders.length > limit
  if (hasMore) orders.pop()

  return { orders, hasMore }
}