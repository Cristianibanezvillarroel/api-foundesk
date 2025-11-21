const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.foundesk.cl",
  port: 587,               // 587 STARTTLS | 465 SSL
  secure: true,           // false para 587, true para 465
  auth: {
    user: process.env.MAIL_USER,     // ej: no-reply@foundesk.cl
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // evita problemas con certificados
  }
});

module.exports = transporter;
