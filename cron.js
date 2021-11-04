const CronJob = require('cron').CronJob;
const { spawn } = require("child_process");

let job = new CronJob('0 */30 8-00/1 * * *', function() {
    console.log("@@@@@ RUN STARTED @@@@@");
    console.log(process.platform);

    let isWin = process.platform.includes('win');
    let cmd = isWin ? 'npm.cmd' : 'npm';
    let runFacebook = isWin ? 'facebook' : 'linux:facebook';
    let runYad2 = isWin ? 'yas2' : 'linux:yad2';
    
    const yad2 = spawn(cmd, ['run', runYad2 + `:${process.env.NODE_ENV.trim()}`]);
    const automation = spawn(cmd, ['run', runFacebook + `:${process.env.NODE_ENV.trim()}`]);

    automation.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    yad2.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

});

console.log("CRON STARTED");
job.start();