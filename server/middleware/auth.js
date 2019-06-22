const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  let cookies = req.cookies;
  // 1. If no cookies, generate a session
  if (Object.keys(cookies).length === 0) {
    models.Sessions.create()
      .then((data) => {
        models.Sessions.get({id: data.insertId })
          .then((session) => {
            req.session = session;
            res.cookie('shortlyid', session.hash)
            console.log('session created for no cookies');
            next();
          })
          .catch(err => {
            console.log('Error getting session for no cookies');
            res.status(404).send('Error');
          })
      })
  } else if (Object.keys(cookies).length > 0) {
    models.Sessions.create()
      .then((data) => {
        models.Sessions.get({id: data.insertId })
          .then((session) => {
            req.session = session;
            res.cookie('shortlyid', session.hash)
            console.log('session created for no cookies');
            next();
          })
          .catch(err => {
            console.log('Error getting session for no cookies');
            res.status(404).send('Error');
          })
      })

    // if (/*if (select hash from sessions) exists*/) {
    //   models.Sessions.get({hash: req.cookies.shortlyid})
    //   .then((session) => {
    //     /*verify hash to cookies*/ 
    //     if (verified) {
    //       // create req.session
    //       req.session = session
    //     }
    //   })

    // }
  } 
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

/* End of day notes:

When a user is not logged in, their session, 
userID in the sessions table.

Hypothetically, when a user logs in, their userid
would then be associated with their hash/cookie
in the sessions table.

*/