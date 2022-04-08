const CronJob = require('cron').CronJob;
const { spawn } = require("child_process");

let defaultMin = process.env.CRON_MIN_START || '0';
let cronTime = `0 ${defaultMin} 8-00/1 * * *`;
console.log({ cronTime });
printCurrentTime();

let job = new CronJob(cronTime, function() {
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

function printCurrentTime() {
  let currentdate = new Date(); 
  let datetime = "Current Mechine Time: " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();

  console.log({ datetime });
}

console.log("CRON STARTED");
job.start();