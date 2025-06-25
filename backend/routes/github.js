const express = require('express');
const passport = require('passport');
const controller = require('../controllers/github.controller');
const dataController = require('../controllers/github.data.controller');

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user', 'repo', 'read:org'] }));

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/',
  session: true
}), controller.githubCallback);

router.get('/status', controller.getStatus);

router.delete('/integration/:id', controller.removeIntegration);
router.get('/fetch/orgs', dataController.fetchOrganizations);
router.get('/fetch/repos', dataController.fetchRepos);
router.get('/sync', dataController.syncGit);


module.exports = router;
