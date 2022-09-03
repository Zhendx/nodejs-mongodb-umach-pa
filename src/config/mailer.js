const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "virtualasistenteutmach@gmail.com", // generated ethereal user
    pass: "lfryjmgoyjadyque", // generated ethereal password
  },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});