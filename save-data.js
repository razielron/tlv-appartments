const fs = require('fs');
const data = require('./data');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(data.telegramToken, {polling: true});

function isAlreadySaved(allData, postData) {
    for(let i = 0; i < allData.postsData.length; i++)
        if(allData.postsData[i].postUrl === postData.postUrl)
            return true;

    return false;
}

function isMatch(postData) {
    return true;
}

function saveToFile(postData) {
    let allData = { postsData: [] };

    if(fs.existsSync('postsData.json')) {
        allData = fs.readFileSync('postsData.json', 'utf8');
        allData = JSON.parse(allData);
    }

    if(!isAlreadySaved(allData, postData) && isMatch(postData)) {
        bot.sendMessage(data.channelId, postData.postUrl, {disable_web_page_preview: true});
        allData.postsData.push(postData);
        allData = JSON.stringify(allData);
        fs.writeFileSync('postsData.json', allData);
    }
}

module.exports = {
    isAlreadySaved,
    isMatch,
    saveToFile
}