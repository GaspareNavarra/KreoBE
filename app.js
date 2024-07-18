const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

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

app.get('/', async (req, res, next) => {
  console.log('Working...');
  res.send('This is the main page!');
  // next();
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

app.get('/search-customer', async (req, res) => {

  axios.get('https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/customer').then((response) => {
    console.log(response);
    let data = response.data;

    return res.status(200).send(data);
  }).catch((error) => {
    console.log(error);
    return res.status(404).send({result: 404});
  });
});
app.listen(port, () => console.log('App di esempio per http://localhost:' + port));