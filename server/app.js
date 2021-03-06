const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');
const db = require('./db/index');
const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));



app.get('/', 
  (req, res) => {
    res.render('index');
  });

app.get('/create', 
  (req, res) => {
    res.render('index');
  });

app.get('/links', 
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links', 
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/signup', 
  (req, res, next) => {
    var password = req.body.password;
    var username = req.body.username;
    db.query(`SELECT username FROM users WHERE username = "${username}"`, (err, user) => {
      if (err) {
        console.error(err);
        res.status(404).send('Error!');
      } else if (user.length === 0) {
        models.Users.create({username, password});
        console.log('Created user!');
        res.redirect(201, '/');
      } else {
        res.redirect('/signup');
      }
    });
  });

app.post('/login',
  (req, res, next) => {
    var salt;
    var password;
    var username = req.body.username;
    var attemptedPW = req.body.password;
    var checkPassword = function () {
      var bool = models.Users.compare(attemptedPW, password, salt);
      if (bool) {
        console.log('Successfully logged in');
        res.redirect('/');
      } else {
        console.log('Error logging in');
        res.redirect(404, '/login');
      }
    };

    db.query(`SELECT salt, password FROM users WHERE username = "${username}"`, (err, data) => {
      if (err || data.length === 0) {
        console.error(err);
        res.redirect(404, '/login');
      } else {
        salt = data[0].salt;
        password = data[0].password;
        checkPassword();
      } 
    });
  });


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
