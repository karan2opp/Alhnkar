import { Resend } from 'resend';
import 'dotenv/config';


const resend = new Resend(`${process.env.EMAIL_API_KEY}`);


const sendVerificationEmail = async (email,token) => {
  try {
    
      const url = `http://localhost:8000/api/auth/verifyEmail/${token}`;
    const response = await resend.emails.send({
      from: 'alhnkar <noreply@karanop.in>',
      to: email,
      subject: 'Hello World',
      html:  `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });

   
  } catch (error) {
    console.log("Error:", error);
  }
};
const sendResetPasswordEmail = async (email,token) => {
  try {
    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email, // later make this dynamic
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click <a href="${url}">here</a> to reset your password.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

   
  } catch (error) {
    console.log("Error:", error);
  }
};
export  {sendVerificationEmail,sendResetPasswordEmail};