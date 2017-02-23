const Check = require('../base-check');
const semver = require('semver');

// Verify that the version number for the project is valid
class ValidVersionCheck extends Check {

  async check() {
    let version = this.pkgjson.version;
    if (semver.valid(version)) {
      this.pass('Package has valid version number', version);
    } else {
      this.fail(
        'Package has invalid version number',
        'package.json',
        'valid semver',
        version);
    }
  }

}

module.exports = ValidVersionCheck
