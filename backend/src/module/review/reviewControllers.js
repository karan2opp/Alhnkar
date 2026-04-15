import ApiResponse from "../../common/utils/apiResponse.js"
import * as reviewService from "./reviewServices.js"

const addReview=async(req,res)=>{
 const review=await reviewService.addReview(req.body,req.user.id,req.files)
 ApiResponse.created(res,"Review added succesfully",review)
}

const deleteReview=async (req,res) => {
    await reviewService.deleteReview(req.params.id,req.user.id) 
    ApiResponse.ok(res,"deleted succesfully")
}
const updateReview = async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,   // reviewId
    req.user.id,     // userId
    req.body,        
    req.files        
  );

  ApiResponse.ok(res, "Review updated successfully", review);
};


const getReviewsByUserId = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const reviews = await reviewService.getReviewsByUserId(
    req.params.id,
    Number(page),
    Number(limit)
  );

  ApiResponse.ok(res, "User reviews fetched successfully", reviews);
};

const getReviewsByProductId = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const reviews = await reviewService.getReviewsByProductId(
    req.params.id,
    Number(page),
    Number(limit)
  );

  ApiResponse.ok(res, "Product reviews fetched successfully", reviews);
};


export {addReview,deleteReview,updateReview, getReviewsByUserId, getReviewsByProductId}