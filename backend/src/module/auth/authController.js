import ApiResponse from "../../../src/common/utils/apiResponse.js"
import * as authService from "./authService.js"
const register=async(req,res)=>{
    const {name,email,password}=req.body
    const user=await authService.register(name,email,password)
 ApiResponse.created(
    res,
    "Registration successful. Please verify your email.",
    user,
  );

}

const login=async(req,res)=>{
  const {email,password}=req.body
  const {user,accessToken,refreshToken}=await authService.login(email,password)
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  ApiResponse.ok(res, "Login successful", { user, accessToken });
}


const logout = async (req, res) => {
  try {
    await authService.logout(req.user.id); // use req.user.id from auth middleware, not req.body.id
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return ApiResponse.ok(res, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

const verifyEmail=async(req,res)=>{
  await authService.verifyEmail(req.params.token)
  console.log(res);
  return res.redirect(`${process.env.FRONTEND_URL}/login`);
  
   ApiResponse.ok(res, "Email verified successfully");
}

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  
; 
  const { accessToken } = await authService.refresh(token);
 
  
  ApiResponse.ok(res, "Token refreshed", { accessToken });
};



const forgotPassword = async (req, res) => {
  console.log("Forgot password route hit");
  console.log(req.body);

  await authService.forgotPassword(req.body.email);
  ApiResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "Password reset successful");
};

const getMe = async (req, res) => {
   
   
  const user = await authService.getMe(req.user.id);
 
 
  
  ApiResponse.ok(res, "User profile", user);
};

export const updateProfile = async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body, req.file)
  ApiResponse.ok(res, "Profile updated successfully", user)
}

export const getProfile = async (req, res) => {
  const user = await authService.getProfile(req.user.id)
  ApiResponse.ok(res, "Profile fetched successfully", user)
}
export {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};