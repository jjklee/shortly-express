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