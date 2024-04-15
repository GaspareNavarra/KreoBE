const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://kreo-liard.vercel.app'); //'http://localhost:5173','https://kreo-liard.vercel.app'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'x-Requested-With,content-type,datainizio,datafine,token,schema');
  next();
});

app.use('/', async (req, res, next) => {
  console.log('Working...');
  // res.status(200).send('This is the main page!');
  next();
});

app.post('/send-mail', async (req, res) => {
  
  console.log(res);
  console.log(req);

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