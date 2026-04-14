import * as addressService from "./addressServices.js"
import ApiResponse from "../../common/utils/apiResponse.js"

export const createAddress = async (req, res) => {
  const address = await addressService.createAddress(req.user.id, req.body)
  ApiResponse.created(res, "Address created successfully", address)
}

export const updateAddress = async (req, res) => {
  const address = await addressService.updateAddress(req.params.id, req.user.id, req.body)
  ApiResponse.ok(res, "Address updated successfully", address)
}

export const deleteAddress = async (req, res) => {
  await addressService.deleteAddress(req.params.id, req.user.id)
  ApiResponse.ok(res, "Address deleted successfully", null)
}

export const getAddresses = async (req, res) => {
  const addresses = await addressService.getAddresses(req.user.id)
  ApiResponse.ok(res, "Addresses fetched successfully", addresses)
}