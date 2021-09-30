const CronJob = require('cron').CronJob;
const { spawn } = require("child_process");

let job = new CronJob('0 */30 8-23/1 * * *', function() {
    console.log("@@@@@ RUN STARTED @@@@@");
    console.log(process.platform);

    let isWin = process.platform.includes('win');
    let cmd = isWin ? 'npm.cmd' : 'cpm';
    
    const automation = spawn(cmd, ['run', 'automation']);

    automation.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

});

console.log("CRON STARTED");
job.start();