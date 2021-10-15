console.log(`CRED: ./creds/${process.env.NODE_ENV.trim()}`);

const creds = require(`./creds/${process.env.NODE_ENV.trim()}`);

module.exports = creds;