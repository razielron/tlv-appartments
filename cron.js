const CronJob = require('cron').CronJob;
const { spawn } = require("child_process");

let job = new CronJob('0 */30 8-00/1 * * *', function() {
    console.log("@@@@@ RUN STARTED @@@@@");
    console.log(process.platform);

    let isWin = process.platform.includes('win');
    let cmd = isWin ? 'npm.cmd' : 'npm';
    let runCmd = isWin ? 'automation' : 'linux:automation';
    
    const automation = spawn(cmd, ['run', runCmd + `:${process.env.NODE_ENV.trim()}`]);

    automation.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

});

console.log("CRON STARTED");
job.start();