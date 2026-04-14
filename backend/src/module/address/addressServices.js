import Address from "./addressModels.js"
import ApiError from "../../common/utils/apiError.js"

export const createAddress = async (userId, data) => {
  const { street, city, state, pincode, isDefault } = data

  // if new address is default, remove default from all other addresses
  if (isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } })
  }

  const address = await Address.create({ user: userId, street, city, state, pincode, isDefault })
  return address.toObject()
}

export const updateAddress = async (addressId, userId, data) => {
  const address = await Address.findOne({ _id: addressId, user: userId })
  if (!address) throw ApiError.notFound("Address not found")

  // if updating to default, remove default from others first
  if (data.isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } })
  }

  if (data.street)  address.street  = data.street
  if (data.city)    address.city    = data.city
  if (data.state)   address.state   = data.state
  if (data.pincode) address.pincode = data.pincode
  if (data.isDefault !== undefined) address.isDefault = data.isDefault

  await address.save()
  return address.toObject()
}

export const deleteAddress = async (addressId, userId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId })
  if (!address) throw ApiError.notFound("Address not found")

  // if deleted address was default, set most recent address as default
  if (address.isDefault) {
    const latest = await Address.findOne({ user: userId }).sort({ createdAt: -1 })
    if (latest) {
      latest.isDefault = true
      await latest.save()
    }
  }

  return address.toObject()
}

export const getAddresses = async (userId) => {
  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 })
  return addresses
}