const nodemailer = require('nodemailer');

// Configurez votre service de messagerie
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser un autre service comme SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // L'e-mail de l'expéditeur
    pass: process.env.EMAIL_PASS, // Le mot de passe ou token pour l'authentification
  },
});

const sendVerificationEmail = (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your email address',
    html: `
      <h2>Welcome!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
