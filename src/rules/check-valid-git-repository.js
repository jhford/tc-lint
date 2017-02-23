const Check = require('../base-check');
const assert = require('assert');

class ValidGitRepository extends Check {
  async check() {
    let repotype = this.loadEnv('REPOSITORY_TYPE', 'git');
    let repobase = this.loadEnv('REPOSITORY_BASE', 'https://github.com/taskcluster/');

    assert(typeof this.pkgjson.repository === 'object');
    assert(typeof this.pkgjson.repository.type === 'string');
    assert(typeof this.pkgjson.repository.url === 'string');

    let repo = this.pkgjson.repository.url;

    repobase = repobase.replace('.', '[.]');
    if (new RegExp(`/^${repobase}`).test(repo)) {
      this.fail('Package missing repository url', 'package.json:repository.url', `${repobase}...`, repo); 
    } else {
      this.pass('Package has valid repository', repo);
    }
  }
}

module.exports = ValidGitRepository;
