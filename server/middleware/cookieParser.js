const parseCookies = (req, res, next) => {
  req.cookies = {};
  var cookies = req.headers.cookie;
  if (cookies) {
    cookies = cookies.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      var splitIDfromCookies = cookies[i].split('=');
      req.cookies[splitIDfromCookies[0]] = splitIDfromCookies[1];
    }
  }
  next();
};

module.exports = parseCookies;

/*
In middleware/cookieParser.js, write a middleware function
 that will access the cookies on an incoming request, 
 parse them into an object, 
and assign this object to a cookies property on the request
*/