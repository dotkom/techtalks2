const nodemailer = require('nodemailer');

const key = require('../key.json');


const createTransporter = async () => {
  const { MAILUSER } = process.env;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: MAILUSER,
      serviceClient: key.client_id,
      privateKey: key.private_key
    }
  });
  try {
    await transporter.verify();
    return transporter;
  } catch (err) {
    console.log(err);
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
    ...options
  };
  transporter.sendMail(mailOptions, callback);
}

module.exports = sendMail;