const { githubRequest } = require('../helpers/githubClient');
const Organization = require('../models/Organization');
const Repo = require('../models/Repo');

exports.fetchOrganizations = async (req, res) => {
  try {
    const memberships = await githubRequest('https://api.github.com/user/memberships/orgs');
    console.log("memberships = ",memberships)
    const orgs = memberships.map(m => m.organization); // Extract actual orgs
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
    const orgs = await Organization.find({});
    let allRepos = [];
    for (const org of orgs) {
      const repos = await githubRequest(`https://api.github.com/orgs/${org.login}/repos`);
      allRepos = allRepos.concat(repos);
    }
    await Repo.deleteMany({});
    await Repo.insertMany(allRepos);
    res.json({ message: 'Repositories saved', count: allRepos.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
};
