let express = require('express');
let _ = require('lodash');
let router = express.Router();

let sessions = {}

/* GET users listing. */
router.post('/:sessionId', function(req, res, next) {
  let today = new Date();
  let time = today.getTime();
  if (
    req.body.user === undefined ||
    req.params.sessionId === undefined
  ) {
    res.send('please add user/session to body');
  }
  if (sessions[ req.params.sessionId ] === undefined) {
    sessions[ req.params.sessionId ] = {}
    sessions[ req.params.sessionId ].hidden = true
    sessions[ req.params.sessionId ].users = {}
    sessions[ req.params.sessionId ].users[ req.body.user ] = {}
    sessions[ req.params.sessionId ].users[ req.body.user ].last_seen = time
  } else {
    sessions[ req.params.sessionId ].users[ req.body.user ].last_seen = time
  }
  res.send(sessions);
});

router.post('/:sessionId/logon', function(req, res, next) {
  let today = new Date();
  let time = today.getTime();
  if (
    req.body.user === undefined ||
    req.params.sessionId === undefined
  ) {
    res.send('please add user/session to body');
  }
  if (sessions[ req.params.sessionId ] === undefined) {
    sessions[ req.params.sessionId ] = {}
    sessions[ req.params.sessionId ].hidden = true
    sessions[ req.params.sessionId ].users = {}
    sessions[ req.params.sessionId ].users[ req.body.user ] = {}
    sessions[ req.params.sessionId ].users[ req.body.user ] = {last_seen: time, score: null, username: req.body.user}
  } else {
    sessions[ req.params.sessionId ].users[ req.body.user ] = {last_seen: time, score:null, username: req.body.user}
  }
  res.send(sessions);
});

router.post('/:sessionId/logout', function(req, res, next) {
  if (
    req.body.user !== undefined ||
    req.params.sessionId !== undefined ||
    req.params.sessionId === "" ||
    req.body.user === ""
  ) {
    delete sessions[ req.params.sessionId ].users[req.body.user]
    if ( _.isEmpty( sessions[ req.params.sessionId ].users) ) {
      console.log(sessions)
      delete sessions[ req.params.sessionId ]
    }
    res.send(sessions);
  } else {
    res.send('please add user/session to body');
  }
});

router.post('/:sessionId/score', function(req, res, next) {
  if (
    req.body.user !== undefined ||
    req.params.sessionId !== undefined ||
    req.params.sessionId === "" ||
    req.body.user === "" ||
    req.body.score === undefined ||
    req.body.score === ""
  ) {
    sessions[ req.params.sessionId ].users[ req.body.user ].score = req.body.score
    res.send(sessions);
  } else {
    res.send('please add user/score to body');
  }
});

router.post('/:sessionId/show', function(req, res, next) {
  if (
    req.params.sessionId !== undefined ||
    req.params.sessionId === ""
  ) {
    sessions[ req.params.sessionId ].hidden = false
    res.send(sessions);
  } else {
    res.send('please add user/score to body');
  }
});

router.post('/:sessionId/reset', function(req, res, next) {
  if (
    req.params.sessionId !== undefined ||
    req.params.sessionId === ""
  ) {
    sessions[ req.params.sessionId ].hidden = true
    Object.keys(sessions[ req.params.sessionId ].users).forEach((key) => {sessions[ req.params.sessionId ].users[ key ].score = null})
    res.send(sessions);
  } else {
    res.send('please add user/score to body');
  }
});

module.exports = router;
