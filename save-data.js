const fs = require('fs');
const data = require('./data');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(data.telegramToken, {polling: true});

module.exports = function saveToFile(postData) {
    let allData = { postsData: [] };
    let isAlreadySaved = false;

    if(fs.existsSync('postsData.json')) {
        allData = fs.readFileSync('postsData.json', 'utf8');
        allData = JSON.parse(allData);
    }

    for(let i = 0; i < allData.postsData.length && !isAlreadySaved; i++) {
        isAlreadySaved = (allData.postsData[i].postUrl === postData.postUrl);
    }

    if(!isAlreadySaved) {
        bot.sendMessage(data.channelId, postData.postUrl);
        allData.postsData.push(postData);
        allData = JSON.stringify(allData);
        fs.writeFileSync('postsData.json', allData);
    }
}