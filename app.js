const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //'http://localhost:5173','https://kreo-liard.vercel.app'
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-Requested-With,content-type,datainizio,datafine,token,schema,Authorization"
  );
  next();
});

app.get("/", async (req, res, next) => {
  console.log("Working...");
  res.send("This is the main page!");
  // next();
});

app.post("/send-mail", async (req, res) => {
  const { authorization } = req.headers;
  const { email } = req.body;
  const { subject } = req.body;
  const { text } = req.body;
  const config = {
    headers: { Authorization: authorization },
  };

  axios
    .get("https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/auth/me", config)
    .then(async (response) => {
      if (response.status != 200)
        res.status(response.status).send({ data: response.data });
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "gaspare.navarra4@gmail.com",
          pass: "mzdr ifot mevj odyn",
        },
      });

      const msg = {
        from: "Kreo <kreo@gmail.com>",
        to: email,
        subject: subject,
        text: text,
      };

      await transporter.sendMail(msg);

      res.status(200).send(msg);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/search-customer", async (req, res) => {
  const { authorization } = req.headers;
  const config = {
    headers: { Authorization: authorization },
  };

  axios
    .get("https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/customer", config)
    .then((response) => {
      console.log(response);
      let data = response.data;

      return res.status(200).send(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(404).send({ error: error });
    });
});

app.post("/save-entrance", async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  const config = {
    headers: { Authorization: authorization },
  };

  axios.post("https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/ingressi", body, config)
  .then((response) => {
    if(response.status == 200) {
      let url = "https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/ingressi/entrances/{customer_id}";
      url = url.replace("{customer_id}", body.customer_id);
      
      axios.get(url, config)
      .then((call) => {
        if(call.status == 200) {
          // Una volta recuperati gli ingressi del customer bisogna controllare quanti sono, se sono più del valore deciso allora si cancella l'ultimo ingresso
          let entrances = call.data;
          
          if(entrances.length > 8) {
            let toDelete = entrances.slice(0, -8).map(obj => obj.id);
            let url = "https://x8ki-letl-twmt.n7.xano.io/api:Fh-KZon-/ingressi/{ingressi_id}";
            Object.values(toDelete).forEach((id) => {

              axios.delete(url.replace("{ingressi_id}", id), config)
              .then((data) => {
                console.log(data);
                if(data.status == 200) {
                  return res.status(200).send({status: 200});
                } else {
                  return res.status(404).send({ error: error });  
                }
              }).catch((error) => {
                console.log(error);
                return res.status(404).send({ error: error });
              });
            });
          } else {
            return res.status(200).send({status: 200});
          }
        }
      }).catch((error) => {
        console.log(error);
        return res.status(404).send({ error: error });
      });
    }
  }).catch((error) => {
    console.log(error);
    return res.status(404).send({ error: error });
  });
});
app.listen(port, () =>
  console.log("App di esempio per http://localhost:" + port)
);
