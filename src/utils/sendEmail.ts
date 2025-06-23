import nodemailer from 'nodemailer';

interface SendEmailParams {
  recipient: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({ recipient, subject, body }: SendEmailParams): Promise<void> => {
  const emailService = process.env.EMAIL_SERVICE;
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailService || !emailUser || !emailPassword) {
    throw new Error("Missing email configuration in environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  const mailOptions = {
    from: emailUser,
    to: recipient,
    subject,
    text: body,    // fallback for plain-text email clients
    html: body,      // now enables HTML formatting
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // rethrow to let caller handle it
  }
};
