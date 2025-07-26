import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();



router.post("/send-email", async (req, res) => { 
    try {
        const { story, newChapter, profile } = req.body;
       // console.log("Request body:", req.body);
        // Validate input
     
            console.log("Sending email to:", profile.email);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS,
        },
      });
console.log("Transporter created successfully", transporter);
      await transporter.sendMail({
        from: `"StoryTime AI" <${process.env.SMTP_EMAIL}>`,
        to: profile.email,
        subject: `🎉 Your Chapter Request was created successfully!`,
        html: `
          <p>Hi ${profile.name || "there"},</p>
          <p>Your chapter request for the story <strong>"${story.title}"</strong> has been submitted successfully.</p>
          <p>We're excited to see what comes next!</p>
          <br/>
          <p>— The StoryTime AI Team</p>
   
            
        `,
      });
    
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
    }
);
// Export the router
export default router;