const nodemailer = require('nodemailer');

const createTransporter = async () => {
  const { MAILUSER } = process.env;
  const { GMAIL_OAUTH_PRIVATE_KEY } = process.env;
  const { GMAIL_OAUTH_CLIENT_ID } = process.env;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: MAILUSER,
      serviceClient: GMAIL_OAUTH_CLIENT_ID,
      privateKey: GMAIL_OAUTH_PRIVATE_KEY,
    },
  });
  try {
    await transporter.verify();
    return transporter;
  } catch (err) {
    return null;
  }
};

const sendMail = async (options, callback) => {
  const transporter = await createTransporter();
  if (transporter === null) {
    return;
  }
  const mailOptions = {
    from: `Tech Talks <info@techtalks.no>`, // sender address
    ...options,
  };
  transporter.sendMail(mailOptions, callback);
};

module.exports = sendMail;
