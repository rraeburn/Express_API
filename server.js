'use strict';
var express = require('express');
var mongoose = require('mongoose');
var villainsRoutes = require('./routes/villains_routes');
var usersRoutes = require('./routes/users_routes');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/villainsapp_development');

var app = express();
app.set('appSecret', process.env.SECRET || 'supercrazybadguystuff');
app.use(passport.initialize());
require('./lib/passport_strat')(passport);

var villainsRouter = express.Router();
var usersRouter = express.Router();

villainsRoutes(villainsRouter, app.get('appSecret'));
usersRoutes(usersRouter, passport, app.get('appSecret'));

app.use('/api/v1', villainsRouter);
app.use('/api/v1', usersRouter);

app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});