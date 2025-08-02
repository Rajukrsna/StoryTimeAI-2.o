import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();



// ...existing code...

const emailTemplate = ({ greeting, message, storyTitle, footer }) => `
  <div style="background:#f9fafb;padding:32px 0;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);padding:32px 24px;font-family:Segoe UI,Arial,sans-serif;">
      <div style="text-align:center;">
        <img src="https://i.ibb.co/v4DVrSMY/logo.png" alt="StoryTime AI" style="width:48px;height:48px;margin-bottom:16px;" />
        <h2 style="margin:0 0 12px 0;color:#222;font-size:1.5rem;">StoryTime.AI</h2>
      </div>
      <p style="font-size:1.1rem;color:#333;margin-bottom:16px;">${greeting}</p>
      <div style="background:#f3f4f6;padding:16px 20px;border-radius:8px;margin-bottom:20px;">
        <strong style="color:#4f46e5;">${storyTitle}</strong>
      </div>
      <p style="font-size:1rem;color:#444;margin-bottom:24px;">${message}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <div style="font-size:0.95rem;color:#888;text-align:center;">
        ${footer}
      </div>
    </div>
  </div>
`;

router.post("/send-email", async (req, res) => { 
  try {
    const { story,profile, type } = req.body;
    const title = req.body?.story?.story?.title;
    console.log("ifo", req.body);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    let html, subject;

    if (type === "new") {
      subject = `✏️ Chapter Request Created for "${story.title}"!`;
      html = emailTemplate({
        greeting: `Hi ${profile.name || "there"},`,
        storyTitle: `Story: "${story.title}"`,
        message: `Your chapter request has been submitted successfully.<br>
          We're excited to see what comes next!<br><br>
          <em>Tip: Invite friends to add their own twists and turns!</em>`,
        footer: "— The StoryTime AI Team"
      });
      await transporter.sendMail({
        from: `"StoryTime AI" <${process.env.SMTP_EMAIL}>`,
        to: story.author.email,
        subject: "You got a new Chapter Request from StoryTime AI by the Author " + profile.name,
        html: emailTemplate({
          greeting: `Hi ${story.author.name || "there"},`,
          storyTitle: `Story: "${story.title}"`,
          message: `A new chapter request has been created by ${profile.name}.<br>
            Please review it and approve or request changes.<br><br>
            <strong>Tip: Collaborate with friends for more fun!</strong>`,
          footer: "— The StoryTime AI Team"
        }),
      })
    } else if (type === "publish") {
      subject = `🎉 Your Story "${title}" Was Published!`;
      html = emailTemplate({
        greeting: `Hi ${profile.name || "there"},`,
        storyTitle: `Story: "${title}"`,
        message: `Your story has been published successfully.<br>
          Thank you for sharing your creativity with us!<br><br>
          <strong>Ready for your next adventure?</strong>`,
        footer: "— The StoryTime AI Team"
      });
    } else {
      console.log("hellooo",story.author.email)
     subject = `📖 New Chapter Request for "${story.title}"!`;
      html = emailTemplate({
        greeting: `Hi ${profile.name || "there"},`,
        storyTitle: `Story: "${story.title}"`,
        message: `A new chapter has been added to your story.<br>
          Please review it and request changes.<br><br>
          <strong>Tip: Collaborate with friends for more fun!</strong>`,
        footer: "— The StoryTime AI Team"
      });
    }

    await transporter.sendMail({
      from: `"StoryTime AI" <${process.env.SMTP_EMAIL}>`,
      to: profile.email,
      subject,
      html,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// ...existing code...
// Export the router
export default router;