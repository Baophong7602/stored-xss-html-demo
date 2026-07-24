const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");

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

function sanitizeInput(value) {
  value = value
    .replace(/<script/gi, "&lt;script")
    .replace(/<\/script>/gi, "&lt;/script&gt;");

  return sanitizeHtml(value, {
    allowedTags: [
      "b",
      "i",
      "u",
      "strong",
      "em",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "div",
      "ul",
      "ol",
      "li",
    ],
    allowedAttributes: {},
  });
}

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));

  res.render("index", {
    comments: data.comments || [],
  });
});

app.post("/comment", (req, res) => {
  const data = JSON.parse(fs.readFileSync("db.json"));

  data.comments.push({
    name: sanitizeInput(req.body.name),
    email: req.body.email,
    website: req.body.website,
    comment: sanitizeInput(req.body.comment),
  });

  fs.writeFileSync("db.json", JSON.stringify(data, null, 4));

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
