const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to check if server is alive
app.get('/ping', (req, res) => res.send('pong'));

// POST /send endpoint
app.post('/send', async (req, res) => {
  const { firstName, lastName, phone, email, property, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Set this in Render
      pass: process.env.EMAIL_PASS   // Set this in Render
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: '📬 New Lead from Sell Us Your Land Contact Form',
    replyTo: email,
    text: `
New message from the website contact form:

👤 Name: ${firstName} ${lastName}
📞 Phone: ${phone}
📧 Email: ${email}

🏡 Property Info:
${property}

📝 Message:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
