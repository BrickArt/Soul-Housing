var nconf = require('nconf');
var join = require('path').join;

var ENV = process.env.NODE_ENV;

if (!ENV){
  ENV = 'dev'
}

nconf.argv()
  .env()
  .file({ file: join(__dirname, ENV + '.json') });

module.exports = nconf;
