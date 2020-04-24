  const findUser = (id, usersDatabase) => {
    let output = null;
    
    for (let user in usersDatabase){

      if (usersDatabase[user].id === id) {
        output = usersDatabase[user];
        break;
      };
    };
    return output;
  };

  const getURLList = (id, urlDatabase) =>  {
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

  const updateURL = (id, url, update, urlDatabase) => {
    id === urlDatabase[url].userID ?
    urlDatabase[url].longURL = update:
    false;
  };

  const checkUser = (email, res, usersDatabase) => {
    for (const userID in usersDatabase) {
      if (usersDatabase[userID].email === email) {
        res.status(400).send('Sorry, this user is already registered');
      };
    };
  };

  const passUserAuth = (userEmail, usersDatabase) => {
    let output = null;
    for (let id in usersDatabase) {
      if (userEmail === usersDatabase[id].email) { 
        output = usersDatabase[id];
        break;
      };
    }; 
    return output;
  };
    


module.exports = {generateRandomString, getURLList, findUser, updateURL, checkUser, passUserAuth}
    // return {
      // findUser,
      // getURLList,
      
      // updateURL,
      // checkUser,
      // passUserAuth
//     };
// };