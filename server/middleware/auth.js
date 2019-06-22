const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  req.session = {
    userId: req.body.username
  };
  // let cookies = req.cookies;

  // 1. If no cookies, generate a session
  if (models.Sessions.get()) {
    console.log('models.session.create ----------', models.Sessions.create());
  }

  //models.Session.get({username = req.body.username})
  //if session
  //then

  // if (!cookies) {
  //   //generate a session with uniq hash
  //   //set a cookie in the response headers (cookieParser)
  // } else {
  //   //check if cookie is valid
  //   //
  // }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

/*
In middleware/auth.js, write a createSession middleware 
function that accesses the parsed cookies on the request, 
looks up the user data related to that session, and 
assigns an object to a session property on the request 
that contains relevant user information. 
(Ask yourself: what information about the user would 
you want to keep in this session object?) 

An incoming request with no cookies should 
generate a session with a unique hash and store 
it the sessions database. 

The middleware function should use this unique 
hash to set a cookie in the response headers. 
(Ask yourself: How do I set cookies using Express?). 

If an incoming request has a cookie, the 
middleware should verify that the cookie is valid 
(i.e., it is a session that is stored in your database). 

If an incoming cookie is not valid, what do you 
think you should do with that session and cookie?
*/