const passport = require('passport');
var GoogleConnect = require('passport-google-oauth20');
var OutlookStrategy = require('passport-outlook').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var YammerStrategy = require('passport-yammer').Strategy;
const UserParams = require('./user_tools.js').User_Params;
var LocalStrategy = require('passport-local').Strategy;

var config = require('./oAuth.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserParams.findById(id).then((user) => {
    if (user) {
      done(null, user.id);
    } else {
      done(null, null);
    }
  });
});

passport.use(new GoogleConnect({
    callbackURL: config.google.callbackURL,
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    const verifu = undefined;
    if (req.user && req.user.userId) {
      (async () => {
        verifu = await UserParams.findOne({
          userId: req.user.userId
        })
      })();
    }
    if (verifu && (!verifu.google_acc || !verifu.google_acc.googleId)) {
      verifu.google_acc = {
        username: profile.displayName,
        email: profile.EmailAddress,
        googleId: profile.id,
        thumbnail: checkthumb ? checkthumb.value : "",
      }
      verifu.save().then(data => {
        console.log('user officeacc updated')
        done(null, data);
      }).catch(e => console.error(e))
    } else {
      UserParams.findOne({
        userId: profile.id
      }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          let checkthumb = profile.photos[0]
          new UserParams({
            username: profile.displayName,
            userId: profile.id,
            google_acc: {
              username: profile.displayName,
              email: profile.EmailAddress,
              googleId: profile.id,
              thumbnail: checkthumb ? checkthumb.value : "",
            },
            office_acc: {}
            //thumbnail: profile._json.image.url
          }).save().then((newUser) => {
            console.log('new user created: ' + newUser);
            done(null, newUser);
          });
        }
      })
    }
  })
);


passport.use(new OutlookStrategy({
    clientID: config.outlook.clientID,
    clientSecret: config.outlook.clientSecret,
    callbackURL: config.outlook.callbackURL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const verifu = undefined;
      if (req.user && req.user.userId) {
        verifu = await UserParams.findOne({
          userId: req.user.userId
        });
      }
      if (verifu && (!verifu.office_acc || !verifu.office_acc.officeId)) {
        verifu.userAccessToken = accessToken;
        verifu.office_acc = {
          username: profile.displayName,
          email: profile._json.EmailAddress,
          officeId: profile.id,
          thumbnail: "",
        }
        verifu.save().then(data => {
          console.log('user officeacc updated')
          done(null, data);
        }).catch(e => console.error(e))
      } else {
        const existingUser = await UserParams.findOne({
          userId: profile.id
        });
        if (existingUser) {
          console.log('user already exist');
          existingUser.userAccessToken = accessToken;
          await existingUser.save()
          return done(null, existingUser);
        } else {
          console.log('create new Profile');
          new UserParams({
            username: profile.displayName,
            userId: profile.id,
            userAccessToken: accessToken,
            office_acc: {
              username: profile.displayName,
              email: profile._json.EmailAddress,
              officeId: profile.id,
              thumbnail: "",
            },
            google_acc: {}
          }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
);


module.exports = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    UserParams.findOne({ oauthID: profile.id }, function(err, currentuser) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && currentuser !== null) {
        done(null, currentuser);
      } else {
        new UserParams({
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  }
));

passport.use(new GithubStrategy({
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    UserParams.findOne({ oauthID: profile.id }, function(err, currentuser) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && currentuser !== null) {
        done(null, currentuser);
      } else {
        new UserParams({
          username: profile.displayName,
          oauthID: profile.id,
          created: Date.now()
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  }
));

passport.use(new YammerStrategy({
  clientID: config.yammer.clientID,
  clientSecret: config.yammer.clientSecret,
  callbackURL: config.yammer.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    UserParams.findOne({ oauthID: profile.id }, function(err, currentuser) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && currentuser !== null) {
        done(null, currentuser);
      } else {
        new UserParams({
          oauthID: profile.id,
          username: profile.displayName,
          created: Date.now()
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  }
));

comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

passport.use (new LocalStrategy(
  function(username, password, done) {
    UserParams.getUserByUsername(username, function(err, newUser) {
      if (err) throw err;
      if (!newUser) {
        return done(null, false, {message: 'Unknown User'});
      }

      UserParams.comparePassword(password, UserParams.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch) {
          return done(null, newUser);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));