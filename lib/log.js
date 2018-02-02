var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var ENV = process.env.NODE_ENV;

if (!ENV) {
  ENV = 'development'
}

// can be much more flexible than that O_o
function getLogger(module) {
  
  const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  var path = module.filename.split('/').slice(-2).join('/');

  return new winston.createLogger({
    format: combine(
      label({ label: path }),
      timestamp(),
      myFormat
    ),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log', level: 'info' }),
      new winston.transports.Console({
        colorize: true,
        level: (ENV == 'development') ? 'debug' : 'error',
        // label: path
      })
    ]
  });
}

module.exports = getLogger;
