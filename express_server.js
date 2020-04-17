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


// welcomeMsg () = {
//   return `Hello ${this.email} welcome to tinytdBt`
// }

// {


// }
// } 

const usersDatabase = {
  "bhtUf8": {
    id: "bhtuf8",
    email: "shmlangela@shmloostheshmloss.com",
    password: "plumbus"
  },

  "seU832": {
    id: "seU832",
    email: "coding@waythoughspirals.com",
    password : "tuatara"
  }
};

const generateRandomString = () => {
  const output = Math.random().toString(36).slice(2,8);
  return output;
}

const updateURL = (shortURL, update) => {
  urlDatabase[shortURL] = update;
}



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
  let templateVars = {  username: req.cookies["currentUserEmail"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["currentUserEmail"]  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies["currentUserEmail"]  };
  res.render("register", templateVars);
});

app.post('/register', (req, res) => {
  const userEmail = req.body.email;

  const userPass = req.body.password;

  const userID = generateRandomString();

  usersDatabase[userID] = { 
    id : userID,
    email : userEmail,
    password : userPass
   };

  
  res.cookie("currentUser", usersDatabase[userID].id); 
  res.cookie('currentUserEmail', usersDatabase[userID].email)
   
  res.redirect('/urls');


});

app.post("/urls", (req, res) => {
  
  const longURL = req.body.longURL

  console.log(longURL);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
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

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {    username: req.cookies["currentUserEmail"],  shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

