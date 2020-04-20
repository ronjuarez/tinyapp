const express = require("express");
const app = express();
const PORT = 8080; 
const cookieSession = require ('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

app.use(cookieSession({
  name :'session',
  keys: ['826d93b2-825b-11ea-bad1-97b21001305e', '924490ec-825b-11ea-b027-df345e3992c8']
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {  longURL: "http://www.lighthouselabs.ca", userID: "bhtuf8" },
  "b2ter2": {  longURL: "http://www.twitter.com", userID: "bhtuf8" },
  "9sm5xK": {  longURL: "http://www.google.com", userID: "seU832" }
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

const findUser = (id) => {
  let output = null;
  
  for (let user in usersDatabase){

    if (usersDatabase[user].id === id) {
      output = usersDatabase[user];
      break;
    };
  };
  return output;
};

const getURLList = (id) =>  {
  let output = { }

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      let key = url;
      let value = urlDatabase[url].longURL;
      output[key] = value;
    };
  };
  return output;
};

const generateRandomString = () => {
  const output = Math.random().toString(36).slice(2,8);
  return output;
};

const updateURL = (id, url, update) => {
  id === urlDatabase[url].userID ?
  urlDatabase[url].longURL = update:
  false;
};

const checkUser = (email, res) => {
  for (const userID in usersDatabase) {
    if (usersDatabase[userID].email === email) {
      res.status(400).send('Sorry, the user is already registered');
    };
  };
};

const passUserAuth = (userEmail) => {
  let output = null;
  for (let id in usersDatabase) {
    if (userEmail === usersDatabase[id].email) { 
      output = usersDatabase[id];
      break;
    };
  }; 
  return output;
};


app.post('/logout', (req, res) => {
  req.session['currentUser'] = null;
  res.redirect('/urls')
});

app.get('/urls', (req, res) => {
  const userID = req.session ['currentUser'];
  const urls = getURLList(userID);
  const signedInUser = findUser(userID);
  const templateVars = {  user: signedInUser, urlList : urls }
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {  
  const userID = req.session ['currentUser'];
  const signedInUser = findUser(userID);

  let templateVars = {  user : signedInUser };
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session ['currentUser'];
  const signedInUser = findUser(userID);

  let templateVars = {  user : signedInUser };
  res.render("login", templateVars);
});


app.get("/register", (req, res) => {
  const userID = req.session ['currentUser'];
  const signedInUser = findUser(userID);

  let templateVars = {  user : signedInUser };
  res.render("register", templateVars);
});

app.post('/register', (req, res) => {
  const userEmail = req.body.email;

  const userPass = req.body.password;

  const hashedPassword = bcrypt.hashSync(userPass, 10);

  const userID = generateRandomString();

  checkUser(userEmail, res);

  !userEmail || !userPass ?
  res.status(400).send('Registration Invalid!'):
  usersDatabase[userID] = { 
    id : userID,
    email : userEmail,
    password : hashedPassword
   };
 
  req.session['currentUser'] = usersDatabase[userID].id;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  const { email } = req.body;

  const { password } = req.body;

  const user = passUserAuth(email);

  let passAuth = false;

  if (user) {
    passAuth = bcrypt.compareSync(password, user.password);
  } else if (!user || !passAuth) {
    res.status(403).send('Login Invalid!');
  };

  req.session['currentUser'] = user.id;
  res.redirect(`/urls`);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session ['currentUser'];
  const signedInUser = findUser(userID);
  const urlID = req.params.id;
  const longURL  = urlDatabase[urlID].longURL;

  let templateVars = {  user : signedInUser, id : urlID, longURL : longURL  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  
  const longURL = req.body.longURL

  const id = generateRandomString();
  const userID = req.session['currentUser'];

  urlDatabase[id] = {  longURL : longURL, userID : userID  };
  
  res.redirect(`/urls`)  

});

app.post('/urls/:id/update', (req, res) => {
  const userID = req.session ['currentUser'];
  const shortURL = req.params.id;
  const update = req.body.longURL;

  updateURL(userID, shortURL, update);

  res.redirect(`/urls/${shortURL}`)
});

app.post('/urls/:id/delete',(req, res) => {
  const userID = req.session ['currentUser']
  const id = req.params.id;

  userID === urlDatabase[id].userID ? 
  delete urlDatabase[id]:
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