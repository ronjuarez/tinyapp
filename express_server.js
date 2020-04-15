const express = require("express");
const app = express();
const PORT = 8080; 

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function (longURL) {
  const shortURL = Math.random().toString(36).slice(2,8);
  const newURL = {shortURL : longURL}
  urlDatabase[shortURL] = newURL;
}
  

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
;

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const longURL = (req.body.longURL)

  console.log(longURL);
  const shortURL = generateRandomString(longURL);
  res.redirect('/urls/shortURL')  
  res.send("Ok");

});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase.urls};
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

