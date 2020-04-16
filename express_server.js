const express = require("express");
const app = express();
const PORT = 8080; 
const cookieParser = require ('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function (longURL) {
  const shortURL = Math.random().toString(36).slice(2,8);
  urlDatabase[shortURL] = longURL;
  return shortURL;
}

const updateURL = (shortURL, update) => {
  urlDatabase[shortURL] = update;
}

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
;

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("currentUser", username);
  res.redirect('/urls') 
});

app.post('/logout', (req, res) => {
  res.clearCookie('currentUser');
  res.redirect('/urls')
})


app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies["currentUser"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {  username: req.cookies["currentUser"]  };
  res.render("urls_new", templateVars);
});


app.post("/urls", (req, res) => {
  
  const longURL = req.body.longURL

  console.log(longURL);
  const shortURL = generateRandomString(longURL);
  res.redirect(`/urls/${shortURL}`)  

});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const update = req.body.longURL;
  updateURL(shortURL, update);
  console.log(urlDatabase)
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete',(req, res) => {
  const shortURL = req.params.shortURL;
  console.log('here')
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {    username: req.cookies["currentUser"],  shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

