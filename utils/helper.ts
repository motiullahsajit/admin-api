import nodemailer from "nodemailer";

export const sendResetCodeByEmail = async (email: string, code: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ecosync.sup@gmail.com",
        pass: "lvixoruwrmkknrqp",
      },
    });
    const mailOptions = {
      from: "support.ecosync@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset code email:", error);
    throw new Error("Failed to send reset code email");
  }
};
