var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var YammerStrategy = require('passport-yammer').Strategy;
var OutlookStrategy = require('passport-outlook').Strategy;
var User = require('models/user.js');
var config = require('../models/oAuth');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect("/");
});


module.exports = router;