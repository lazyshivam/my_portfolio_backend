const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors=require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Hello, world");
});

app.post('/submit-form', (req, res) => {
  // get form data
  try {
    const { name, email, msg } = req.body;
    console.log(req.body)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // create email message with form data
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New form submission',
      html: `<h3>New Form Submission</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${msg}</p>`
    };

    // send email with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send({success:true,msg:'Error: Email not sent'});
      } else {
        console.log('Email sent: ' + info.response);
        res.send({success:true,msg:'Email sent successfully'});
      }
    });
  } catch (error) {
    console.log(error);
    res.send({success:false,msg:'Error: Something went wrong'});
  }
});

// start server
app.listen(8000 || process.env.PORT, () => {
  console.log('Server started on port 8000');
});
