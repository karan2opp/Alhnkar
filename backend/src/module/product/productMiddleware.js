import ApiError from "../../common/utils/apiError.js"

export const parseFormData = (req, res, next) => {
  if (req.body.variants) {
    try {
      req.body.variants = JSON.parse(req.body.variants)
    } catch {
      throw ApiError.badRequest("Invalid variants format")
    }
  }

  if (req.body.price) req.body.price = Number(req.body.price)
  if (req.body.isActive) req.body.isActive = req.body.isActive === "true"

  next()
}