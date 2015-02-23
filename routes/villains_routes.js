'use strict';
var Villain = require('../models/SuperVillain');
var eat_auth = require('../lib/eat_auth');
var bodyparser = require('body-parser');

module.exports = function(app, appSecret) {
  app.use(bodyparser.json());

  app.get('/villains', eat_auth(appSecret), function(req, res) {
    Villain.find({}, function(err, data) {
      if(err) return res.status(500).send({'msg': 'could not retrieve villain'});

      res.json(data);
    });
  });

  app.post('/villains', eat_auth(appSecret), function(req, res) {
    var newVillain = new Villain(req.body);
    newVillain.save(function(err, villain) {
      if (err) return res.status(500).send({'msg':'could not save note'});

      res.json(villain);
    });
  });

  app.put('/villains/:id', eat_auth(appSecret), function(req, res) {
    var updatedVillain = req.body;
    delete updatedVillain._id;
    Villain.update({_id: req.params.id}, updatedVillain, function(err) {
      if (err) return res.status(500).send({'msg':'could not update villain'});

      res.json(req.body);
    });
  });

  app.delete('/villains/:id', eat_auth(appSecret), function(req, res) {
    var deletedVillain;
    Villain.find({_id: req.params.id}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not delete villain'});
      deletedVillain = data;
    });
    Villain.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send({'msg':'could not delete villain'});

      res.json(deletedVillain);
    });
  });
};