const express = require('express');
const passport = require('passport');
const controller = require('../controllers/github.controller');

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user', 'repo', 'read:org'] }));

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/',
  session: true
}), controller.githubCallback);

router.get('/status', controller.getStatus);

router.delete('/integration/:id', controller.removeIntegration);

module.exports = router;
