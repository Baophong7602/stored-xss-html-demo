const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));

  res.render("index", {
    comments: data.comments || [],
  });
});
app.post("/comment", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));

  data.comments.push({
    name: req.body.name,

    email: req.body.email,

    website: req.body.website,

    comment: req.body.comment,
  });

  fs.writeFileSync(
    "db.json",

    JSON.stringify(data, null, 4),
  );

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
