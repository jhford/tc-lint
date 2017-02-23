#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const Check = require('./base-check');

const latest = require('latest-version');
class UsesCodeToolsCorrectly extends Check {
  async check() {
    // This check should verify:
    //  * we have compile script
    //  * we have a lint script
    //  * we call this utility
    //  * pretest script calls compile script
    //  * we have either postinstall or prepublish compile
    //  * we have lint
    //  * we have the taskcluster preset
    //  * we have linter and the required things
  }
}

class PackagesNotDeprecated extends Check {
  async check() {
    // Ensure that all installed packages aren't deprecated
  }
}

class TCLibsUpdated extends Check {
  async check() {
    // Ensure that any installed taskcluster specific libraries are installed that
    // they're at their latest version.
  }
}

class TCLint {
  constructor(root) {
    this.root = root;
    this.pkgjson = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
    this.issues = [];
    let available = fs.readdirSync(path.join(__dirname, 'rules'));
    available = available.filter(x => /^check-.*[.]js$/.test(x));
    available = available.map(x => require(path.join(__dirname, 'rules', x)));

    this.linters = available.map(linter => new linter(root, this.pkgjson));
  }

  async lint() {
    let results = await Promise.all(this.linters.map(linter => linter.runCheck()));
    results.forEach(result => {
      console.log(`${result.code}: ${result.outcome ? 'passed' : 'failed'} -- ${result.message}`);
    });
  }

}

if (!module.parent) {
  require('source-map-support').install();
  let linter = new TCLint(process.cwd());
  linter.lint().then(console.log, console.log);
}

module.exports = {
  TCLint,
};
