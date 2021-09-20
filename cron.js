const CronJob = require('cron').CronJob;
const { exec } = require("child_process");

let job = new CronJob('0 */5 * * * *', function() {
    console.log("@@@@@@@@@@@@@@@")
    exec("npx wdio run ./wdio.conf.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

console.log("START")
job.start();