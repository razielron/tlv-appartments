console.log(`CONF: ./confs/${process.env.NODE_ENV.trim()}`);

const conf = require(`./confs/${process.env.NODE_ENV.trim()}`);

module.exports = conf;