const nodemailer = require('nodemailer');

// Configurez votre service de messagerie
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser un autre service comme SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // L'e-mail de l'expéditeur
    pass: process.env.EMAIL_PASS, // Le mot de passe ou token pour l'authentification
  },
});

const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your verification code',
    html: `
      <h2>Welcome!</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code will expire in 10 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

