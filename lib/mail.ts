import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  ...(process.env.SMTP_API_KEY
    ? { auth: { user: "resend", pass: process.env.SMTP_API_KEY } }
    : {}),
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@budgetduo.local",
    to,
    subject,
    html,
  });
}
