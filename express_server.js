const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { generateRandomString, getURLList, findUser, updateURL, checkUser, passUserAuth } = require('./helpers/dbHelpers')

app.use(cookieSession({
  name: 'session',
  keys: ['826d93b2-825b-11ea-bad1-97b21001305e', '924490ec-825b-11ea-b027-df345e3992c8']
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "bhtuf8" },
  "b2ter2": { longURL: "http://www.twitter.com", userID: "bhtuf8" },
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
    password: bcrypt.hashSync('tuatara', 10)
  }
};


app.post('/logout', (req, res) => {
  req.session['currentUser'] = null;
  res.redirect('/')
});

app.get('/urls', (req, res) => {
  if (req.session['currentUser']) {
    const userID = req.session['currentUser'];
    const urls = getURLList(userID, urlDatabase);
    const signedInUser = findUser(userID, usersDatabase);
    const templateVars = { user: signedInUser, urlList: urls }
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/');
  }
});

app.get("/urls/new", (req, res) => {
  if (req.session['currentUser']) {
    const userID = req.session['currentUser'];
    const signedInUser = findUser(userID, usersDatabase);

    let templateVars = { user: signedInUser };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/');
  }
});

app.get("/", (req, res) => {
  if (req.session['currentUser']) {
    res.redirect("/urls");
  } else {
    let templateVars = { user: false }
    res.render('login', templateVars);
  }
});


app.get("/register", (req, res) => {
  if (req.session['currentUser']) {
    res.redirect("/urls");
  } else {
    let templateVars = { user: false };
    res.render('register', templateVars);
  }
});

app.post('/register', (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;
  const hashedPassword = bcrypt.hashSync(userPass, 10);
  const userID = generateRandomString();

  checkUser(userEmail, res, usersDatabase);

  !userEmail || !userPass ?
    res.status(400).send('Registration Invalid!') :
    usersDatabase[userID] = {
      id: userID,
      email: userEmail,
      password: hashedPassword
    };

  req.session['currentUser'] = usersDatabase[userID].id;
  res.redirect(`/urls`);
});

app.post("/", (req, res) => {

  const { email } = req.body;
  const { password } = req.body;
  const user = passUserAuth(email, usersDatabase);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session['currentUser'] = user.id;
    res.redirect(`/urls`);
  } else {
    res.status(403).send('Login Invalid!');
  }
});

app.get("/urls/:id", (req, res) => {
  if (req.session['currentUser']) {
    const userID = req.session['currentUser'];
    const signedInUser = findUser(userID, usersDatabase);
    const urlID = req.params.id;
    const longURL = urlDatabase[urlID].longURL;

    let templateVars = { user: signedInUser, id: urlID, longURL: longURL };
    res.render("urls_show", templateVars);
  } else {
    res.render('register');
  }
});

app.post("/urls", (req, res) => {

  const longURL = req.body.longURL

  const id = generateRandomString();
  const userID = req.session['currentUser'];

  urlDatabase[id] = { longURL: longURL, userID: userID };

  res.redirect(`/urls`)

});

app.post('/urls/:id/update', (req, res) => {
  const userID = req.session['currentUser'];
  const shortURL = req.params.id;
  const update = req.body.longURL;

  userID === urlDatabase[shortURL].userID ?
    updateURL(userID, shortURL, update, urlDatabase) :
    res.status(403).send('You are not authorized to edit this URL');

  res.redirect(`/urls/${shortURL}`)
});

app.post('/urls/:id/delete', (req, res) => {
  const userID = req.session['currentUser']
  const id = req.params.id;

  userID === urlDatabase[id].userID ?
    delete urlDatabase[id] :
    res.status(403).send('You are not authorized to delete this URL!');

  res.redirect(`/urls`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});