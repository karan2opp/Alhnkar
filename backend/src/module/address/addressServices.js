import Address from "./addressModels.js"
import ApiError from "../../common/utils/apiError.js"
import pinCodeSearch from "india-pincode-search"
export const createAddress = async (userId, data) => {
  const { street, city, state, pincode, isDefault } = data

  // Validate pincode
  const pincodeData = pinCodeSearch.search(pincode)

  if (!pincodeData || pincodeData.length === 0) {
    throw ApiError.badRequest("Invalid pincode")
  }

  const pincodeInfo = pincodeData[0]

  // Optional: verify city and state match the pincode
  if (
    pincodeInfo.district.toLowerCase() !== city.toLowerCase() ||
    pincodeInfo.state.toLowerCase() !== state.toLowerCase()
  ) {
    throw ApiError.badRequest(
      "City or state does not match the provided pincode"
    )
  }

  // If new address is default, remove default from others
  if (isDefault) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    )
  }

  const address = await Address.create({
    user: userId,
    street,
    city,
    state,
    pincode,
    isDefault
  })

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