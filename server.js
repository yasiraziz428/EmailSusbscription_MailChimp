const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const userEmail = req.body.email;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const dc = "us9";
  const ping = "lists";
  const list_id = "ce581d95ca";
  const mailchimp_url = `https://${dc}.api.mailchimp.com/3.0/${ping}/${list_id}`;
  const options = {
    method: "POST",
    auth: "yasir:80db12b5e3c31dd17b859c8ca2eedc3a-us9",
  };
  const data = {
    members: [
      {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const request = https.request(mailchimp_url, options, (response) => {
    response.on("data", (data) => {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(4000);

// apiKey
// 80db12b5e3c31dd17b859c8ca2eedc3a-us9

// listid
// ce581d95ca

// url
// https://${dc}.api.mailchimp.com/3.0/ping
