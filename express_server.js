const express = require("express");
const app = express();
const PORT = 8080; 
const cookieParser = require ('cookie-parser');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");



app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "bhtuf8" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "seU832" }
};

const usersDatabase = {
  "bhtUf8": {
    id: "bhtuf8",
    email: "shmlangela@shmloostheshmloss.com",
    password: bcrypt.hashSync('plumbus', 10)
  },

  "seU832": {
    id: "seU832",
    email: "coding@waythoughtspirals.com",
    password : bcrypt.hashSync('tuatara', 10)
  }
};

const generateRandomString = () => {
  const output = Math.random().toString(36).slice(2,8);
  return output;
}

const updateURL = (shortURL, update) => {
  urlDatabase[shortURL].longURL = update;
}

const checkUser = (email, res) => {
  for (const userID in usersDatabase) {
    if (usersDatabase[userID].email === email) {
      res.status(400).send('Sorry, the user is already registered');
    }
  }
}

app.post('/logout', (req, res) => {
  res.clearCookie('currentUser');
  res.clearCookie('currentEmail');
  res.redirect('/urls')
})

app.get('/urls', (req, res) => {
  let templateVars = {  userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"] }
  res.render('urls_home', templateVars) 
})


app.get("/urls/:id", (req, res) => {
  let templateVars = {  userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"], urls: urlDatabase, id: req.params.id };
  res.render("urls_index", templateVars);
});


app.get("/urls/:id/new", (req, res) => {
  let templateVars = {  userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"]  };
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"]  };
  res.render("login", templateVars);
});


app.get("/register", (req, res) => {
  let templateVars = { userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"]  };
  res.render("register", templateVars);
});

app.post('/register', (req, res) => {
  const userEmail = req.body.email;

  const userPass = req.body.password;

  const hashedPassword = bcrypt.hashSync(userPass, 10);
  console.log(`This is the hashedPassword: ${hashedPassword}`);

  const userID = generateRandomString();

  checkUser(userEmail, res);

  !userEmail || !userPass ?
  res.status(400).send('Registration Invalid!'):
  usersDatabase[userID] = { 
    id : userID,
    email : userEmail,
    password : hashedPassword
   };

   console.log (`This is the user password ${usersDatabase[userID].password}`);

  res.cookie('currentEmail', userEmail); 
  res.cookie("currentUser", usersDatabase[userID].id); 
  res.redirect(`/urls/${userID}`);


});

app.post("/login", (req, res) => {

  const { email } = req.body;

  const { password } = req.body;

  let userID = null;  

  
  for (let id in usersDatabase) {
    if (email === usersDatabase[id].email) {
      userID = usersDatabase[id];
    }
  }
  
  const passAuth = bcrypt.compareSync(password, userID.password);

  console.log(`Password Property: ${password}, passAuth Test Result : ${passAuth}, hashedPassword: ${userID.password}`);

  if (!userID || !passAuth) {
    res.status(403).send('Login Invalid!');
    return;
  }

  res.cookie("currentUser", userID.id);
  res.cookie('currentEmail', email);
  res.redirect(`/urls/${userID.id}`);

  return;
});


app.post("/urls/:id", (req, res) => {
  
  const longURL = req.body.longURL

  const shortURL = generateRandomString();
  const userID = req.params.id;

  urlDatabase[shortURL] = {  longURL : longURL, userID : userID  };
  
  res.redirect(`/urls/${userID}/${shortURL}`)  

});

app.post('/urls/:id/:shortURL', (req, res) => {
  const userID = req.params.id;
  const shortURL = req.params.shortURL;
  const update = req.body.longURL;
  updateURL(shortURL, update);

  res.redirect(`/urls/${userID}`);
});

app.post('/urls/:id/:shortURL/delete',(req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.params.id;

  userID === urlDatabase[shortURL].userID ? delete urlDatabase[shortURL]:
  res.status(400).send('You cannot delete this post!');

  res.redirect(`/urls/${userID}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
})

app.get("/urls/:id/:shortURL", (req, res) => {
  const templateVars = {   userEmail: req.cookies["currentEmail"], userID: req.cookies["currentUser"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };

  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});