const VALID_LEVELS = ['style', 'warning', 'error'];

class Check {

  constructor(root, pkgjson) {
    this.root = root; // root of project directory
    this.pkgjson = pkgjson; // Because it's used so frequently
    this.code = this.constructor.name;
  }

  loadEnv(key, def) {
    if (process.env[key]) {
      return process.env[key];
    }
    return def;
  }

  fail(message, reference, expected, actual) {
    this.outcome = false;
    this.message = message || 'no message';
    this.reference = reference || '<unknown>';
    if (expected) {
      this.message += '\n  Expected: ' + expected;
    }
    if (actual) {
      this.message += '\n  Actual: ' + actual;
    }
  }

  pass(message, actual) {
    this.outcome = true;
    this.message = message;
    if (actual) {
      this.message += '\n  Actual: ' + actual;
    }
  }

  async check() {
    this.outcome = true;
  }

  async runCheck() {
    try {
      await this.check();
    } catch (err) {
      this.fail('LINT CHECK THREW: ' + err, err.stack);
    }

    if (typeof this.outcome === 'undefined') {
      throw new Error('This check did not set an outcome');
    }
    

    if (VALID_LEVELS.indexOf(this.constructor.severity) === -1) {
      throw new Error('This check uses an invalid severity');
    }

    return {
      code: this.code,
      outcome: this.outcome,
      severity: this.constructor.severity,
      message: this.message || null,
      reference: this.reference || null,
    };
  }

}
// Severity is static and defaulting to errors
Check.severity = 'error';

module.exports = Check;
