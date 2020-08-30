const nodemailer = require('nodemailer');

const createTransporter = async () => {
  const { TECHTALKS_MAIL_USER } = process.env;
  const { GMAIL_OAUTH_PRIVATE_KEY } = process.env;
  const { GMAIL_OAUTH_CLIENT_ID } = process.env;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: TECHTALKS_MAIL_USER,
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

async function sendConfirmation(email, hash) {
  const mailOptions = {
    to: email, // list of receivers
    subject: 'Bekreftelse av påmelding', // Subject line
    html: `<p>For å validere påmeldingen din, trykk på denne lenken:<br/>
      <a href="http://techtalks.no/validate?ha=${hash}"><b>http://techtalks.no/validate?ha=${hash}</b></a></p>
      <p>Eventuelle spørsmål kan sendes til <a href="mailto:ekskom@online.ntnu.no">ekskom@online.ntnu.no</a></p>`, // html body
  };
  sendMail(mailOptions, (response) => {
    const { err } = response; // don't need the message for now
    if (err) {
      console.log(err);
    }
  });
}

module.exports = { sendMail, sendConfirmation };
