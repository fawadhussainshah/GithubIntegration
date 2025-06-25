const { githubRequest } = require('../helpers/githubClient');
const Organization = require('../models/Organization');
const Repo = require('../models/Repo');
const Integration = require('../models/Integration'); // assuming this is your model
const Issue = require('../models/Issue');
const Commit = require('../models/Commit');
const PullRequest = require('../models/PullRequest');
const Changelog = require('../models/Changelog');
const User = require('../models/User');


exports.fetchOrganizations = async (req, res) => {
  try {
    const integration = await Integration.findOne({});
    if (!integration || !integration.accessToken) {
      return res.status(400).json({ error: 'No GitHub access token found' });
    }

    const token = integration.accessToken;
    const orgs = await githubRequest('https://api.github.com/user/orgs', token);
    
    await Organization.deleteMany({});
    await Organization.insertMany(orgs);

    res.json({ message: 'Organizations saved', count: orgs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};


exports.fetchRepos = async (req, res) => {
  try {
    const integration = await Integration.findOne({});
    if (!integration || !integration.accessToken) {
      return res.status(400).json({ error: 'No GitHub access token found' });
    }

    const token = integration.accessToken;
    // const orgs = await Organization.find({});
    let allRepos = [];

    // for (const org of orgs) {
      const repos = await githubRequest(`https://api.github.com/user/repos`, token);
      allRepos = allRepos.concat(repos);
    // }

    await Repo.deleteMany({});
    await Repo.insertMany(allRepos);

    res.json({ message: 'Repositories saved', count: allRepos.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
};


exports.syncGit = async (req, res) => {
  try {
    res.json("data integration")
    const integration = await Integration.findOne({});
    if (!integration || !integration.accessToken) {
      console.error('No GitHub access token found');
      return;
    }


    const token = integration.accessToken;
    const [user, orgs] = await Promise.all([
      githubRequest(`https://api.github.com/user`, token),
      githubRequest(`https://api.github.com/user/orgs`, token)
    ]);

    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({})
    ]);

    await Promise.all([
      User.insertMany([user]),
      Organization.insertMany(orgs)
    ]);
    const repos = await githubRequest(`https://api.github.com/user/repos`, token);

    await Repo.deleteMany({});
    await Repo.insertMany(repos);

    const allRepos = await Repo.find({});

    const allIssues = [];
    const allCommits = [];
    const allPulls = [];
    const allReleases = [];

    for (const repo of allRepos) {
      const { name, owner } = repo;
      const [issues, commits, pulls, releases] = await Promise.all([
        githubRequest(`https://api.github.com/repos/${owner.login}/${name}/issues`, token),
        githubRequest(`https://api.github.com/repos/${owner.login}/${name}/commits`, token),
        githubRequest(`https://api.github.com/repos/${owner.login}/${name}/pulls?state=all`, token),
        githubRequest(`https://api.github.com/repos/${owner.login}/${name}/issues/events`, token),
      ]);

      allIssues.push(...issues.filter(issue => !issue.pull_request));
      allCommits.push(...commits);
      allPulls.push(...pulls);
      allReleases.push(...releases);
    }

    await Promise.all([
      Issue.deleteMany({}),
      Commit.deleteMany({}),
      PullRequest.deleteMany({}),
      Changelog.deleteMany({})
    ]);

    await Promise.all([
      Issue.insertMany(allIssues),
      Commit.insertMany(allCommits),
      PullRequest.insertMany(allPulls),
      Changelog.insertMany(allReleases)
    ]);

    console.log('GitHub data synced successfully');
  } catch (err) {
    console.error('Error syncing GitHub data:', err.message || err);
  }
}


const collectionMap = {
  repositories: Repo,
  commits: Commit,
  issues: Issue,
  'pull-requests': PullRequest,
  changelogs: Changelog,
  organizations: Organization,
  users: User
};

exports.searchGitHubData = async (req, res) => {
  try {
    const { entity, q } = req.query;

    if (!entity || !collectionMap[entity.toLowerCase()]) {
      return res.status(400).json({ message: 'Invalid or missing entity type' });
    }

    const Model = collectionMap[entity.toLowerCase()];
    const regex = new RegExp(q, 'i');

    const sampleDoc = await Model.findOne().lean();
    if (!sampleDoc) return res.json({ columnDefs: [], rowData: [] });

    const fields = Object.keys(sampleDoc).filter(
      key => typeof sampleDoc[key] === 'string' || typeof sampleDoc[key] === 'number' || typeof sampleDoc[key] === 'boolean'
    );

    const orQuery = q
      ? fields.map(key => ({
          [key]: { $regex: regex }
        }))
      : [];

    const docs = await Model.find(q ? {  } : {}).limit(10).lean();

    const rowData = docs.map(doc => {
      const row = {};
      fields.forEach(key => {
        row[key] = doc[key];
      });
      return row;
    });

    const columnDefs = fields.map(field => ({ field }));

    res.json({ columnDefs, rowData });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

