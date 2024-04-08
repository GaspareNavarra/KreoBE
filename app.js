const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   console.log('Working...');
//   res.status(200).send('This is the main page!');
// });

app.post('/', async (req, res) => {

  const {email} = req.body;
  const {subject} = req.body;
  const {text} = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'gaspare.navarra4@gmail.com',
      pass: 'mzdr ifot mevj odyn',
    },
  });

  const msg = {
    from: 'Kreo <kreo@gmail.com>',
    to: email,
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(msg);

  console.log('Message sent: %s', info.messageId);

  res.status(200).send(msg);
});

app.listen(port, () => console.log('App di esempio per http://localhost:' + port));