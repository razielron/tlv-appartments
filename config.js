console.log(`CONF: ./configs/${process.env.NODE_ENV.trim()}`);

const conf = require(`./configs/${process.env.NODE_ENV.trim()}`);

module.exports = conf;