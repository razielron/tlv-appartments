# tlv-appartments

# Requirements
1. Docker

# Installation
1. Clone the repo
2. npm ci
3. docker-compose build

# Config
1. Create this file: ./config/<your_name>.json (i.e. ./config/raziel.json)
2. Fill your config acording to the template (./config/raziel.json)
3. Create file: ./creds/<your_name>.json (i.e. ./creds/raziel.json)
4. Fill your creds according to the template (./config/raziel.json)
5. Open package.json, under 'scripts' add this command (line):
    "start": "export NODE_ENV=<your_name> && node cron.js",

# Run
1. Run 'docker-compose up -d'