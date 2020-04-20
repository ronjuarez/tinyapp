const bcrypt = require('bcrypt');


module.exports = (urlDatabase, usersDatabase) => {

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
    
    return {
      findUser,
      getURLList,
      generateRandomString,
      updateURL,
      checkUser,
      passUserAuth
    };
};