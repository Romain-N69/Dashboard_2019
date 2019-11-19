const express = require('express');
const app = express();
const path = require('path');
const authRoutes = require('./routes/auth-routes');
const initWidgets = require('./routes/init_widgets');
const profileRoute = require('./routes/profile_routes');
const passSetup = require('./models/passport-setup');
const mongoose = require('mongoose');
const credentials = require('./models/oAuth');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const Users_tools = require('./models/user_tools')
const flash = require('connect-flash');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/designCss/'));
app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [credentials.session.cookieKey]
}));

app.use(passport.initialize());
app.use(expressValidator())
app.use(passport.session());

app.get('/about.json', (req, res) => {
  var aboutj = require('./models/about.json');
  var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
  res.send({
    "client": {
      "host": ip
    },
    "server": {
      "current_time": Date.now(),
      "services": aboutj
    }
  })
})

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

mongoose.connect('mongodb://mongo:27017', () => {
  //useNewUrlParser: true
  console.log('connected');
});


app.use('/auth', authRoutes);
app.use('/widgets', initWidgets);
app.use('/profile', profileRoute);
//create home route


app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res)
  {
    res.redirect('/auth/settings');
  });


app.get('/auth/register', function(req, res) {
    res.render('register');
  });
  
app.get('/auth/github',
  passport.authenticate('github', {
    scope:
      [
        'user:email',
        'user:name'
      ]
  }),
  function(req, res){});
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res)
  {
    res.redirect('/auth/settings');
  });

app.get('/auth/google',
  passport.authenticate('google',
    {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    }
  ));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/auth/settings');
  });


app.get('/auth/outlook/callback', 
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/settings');
  });

app.get('/auth/yammer',
  passport.authenticate('yammer'),
  function(req, res){});
app.get('/auth/yammer/callback',
  passport.authenticate('yammer', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/auth/settings');
  });

app.get('/login',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/auth/settings');
  });

app.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
  
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();
  
    if(errors){
      res.render('register',{
        errors:errors
      });
    } else {
      var newUser = new User({
        name: name,
        email:email,
        username: username,
        password: password
      });
     User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
      });
      res.redirect('/auth/login');
    }
  });

app.get('/', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    res.render('home', {
      user: userP
    });
  })();
});


app.listen(8080, () => {
  console.log('Server Start');
});