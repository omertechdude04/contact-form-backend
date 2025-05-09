const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { firstName, lastName, phone, email, property, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sellusyourlandnow@gmail.com',
      pass: 'gvgx mara crlu zpyf' // App password, not your Gmail password
    }
  });

  const mailOptions = {
    from: 'sellusyourlandnow@gmail.com',
    to: 'sellusyourlandnow@gmail.com',
    subject: '📬 New Message from SellUsYourLand Contact Form',
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
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
