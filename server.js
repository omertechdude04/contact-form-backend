const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS from your frontend domain
const allowedOrigins = ['https://sellusyourlandnow.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => res.send('pong'));

app.post('/send', async (req, res) => {
  const { firstName, lastName, phone, email, property, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: false
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: '📬 New Lead from Sell Us Your Land Contact Form',
    replyTo: email,
    text: `
You received a new message through your website contact form.

👤 Name: ${firstName} ${lastName}
📞 Phone: ${phone}
📧 Email: ${email}

🏡 Property Info (Address or APN):
${property}

📝 Message:
${message}

———

This message was sent via the SellUsYourLand.com contact page.
To respond, simply click "Reply".
    `
  };

  try {
    console.log("⏳ Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
