const fs = require('fs');
const data = require('./data');
const TelegramBot = require('node-telegram-bot-api');
const {PythonShell} = require('python-shell');
const { result } = require('lodash');
const { exec } = require("child_process");

const bot = new TelegramBot(data.telegramToken, {polling: true});

const syncWait = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}

function isAlreadySaved(allData, postData) {
    for(let i = 0; i < allData.postsData.length; i++)
        if(allData.postsData[i].postUrl === postData.postUrl)
            return true;

    return false;
}

function isMatch(postData) {
    let unmatchData = { unmatchPosts: [] };

    if(fs.existsSync(data.singlePostPath)) {
        fs.unlinkSync(data.singlePostPath);
    }

    fs.writeFileSync(data.singlePostPath, JSON.stringify(postData));

    exec(`py ${data.pythonScriptSinglePost}`, null);
    exec(`python ${data.pythonScriptSinglePost}`, null);
    
    console.log(`Waiting for file: ${data.singlePostResult}`)
    while(!fs.existsSync(data.singlePostResult)) {
        syncWait(5000);
    }

    let result = fs.readFileSync(data.singlePostResult, 'utf8');
    result = JSON.parse(result);
    result = result['result'];

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(result)
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    if(!result) {
        if(fs.existsSync(data.unmatchPath)) {
            unmatchData = fs.readFileSync(data.unmatchPath, 'utf8');
            unmatchData = JSON.parse(unmatchData);
        }

        unmatchData.unmatchPosts.push(postData);
        unmatchData = JSON.stringify(unmatchData);
    }
    
    return result;
}

function saveUnmatch(postData) {

}

function saveToFile(postData) {
    let allData = { postsData: [] };

    if(fs.existsSync(data.allDataPath)) {
        allData = fs.readFileSync(data.allDataPath, 'utf8');
        allData = JSON.parse(allData);
    }

    if(!isAlreadySaved(allData, postData) && isMatch(postData)) {
        bot.sendMessage(data.channelId, postData.postUrl, {disable_web_page_preview: true});
        allData.postsData.push(postData);
        allData = JSON.stringify(allData);
        fs.writeFileSync(data.allDataPath, allData);
    }
}

module.exports = {
    isAlreadySaved,
    isMatch,
    saveToFile
}