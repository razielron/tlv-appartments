const TelegramBot = require('node-telegram-bot-api');
const creds = require('../creds');
const config = require('../config');
const { isProcessable } = require('./filtering/preFiltering');
const { isMatch } = require('./filtering/postFiltering');
const { processText } = require('./processText/processText');
const { getLastPostId, saveMatchPost, saveUnmatchPost } = require('../mongodb/mongodbClient');

let MatchPostsCount = 0, UnmatchPostsCount = 0;

const bot = new TelegramBot(creds.telegramToken, {polling: true});

function sendMatchMessage(postData) { 
    let message = `${postData['postNum']}`;
    message += `\nמספר חדרים: ${postData['rooms']}`;
    message += `\nרחובות אפשריים: ${postData['street']}`;
    message += `\nהתאמת רחובות: ${postData['similarStreets']}`;
    message += `\nמחיר: ${postData['price']}`;
    message += `\nטלפון: ${postData['phone']}`;
    message += `\n${postData['postUrl']}`;

    bot.sendMessage(config.channelId, message, {disable_web_page_preview: true});
}

function processMatch(postData) {
    MatchPostsCount++;
    postData['postNum'] = getLastPostId(true) + 1;
    sendMatchMessage(postData);
    saveMatchPost(postData);
}

function processUnmatch(postData) {
    UnmatchPostsCount++;
    postData['postNum'] = getLastPostId(false) + 1;
    saveUnmatchPost(postData);
}

function processPost(postData) {
    if(!isProcessable(postData)) {
        return console.log('Prefiltering: True');
    }
    
    postData = processText(postData);
    postData['isMatch'] = isMatch(postData);

    if(postData['isMatch']['isAllMatch']) {
        processMatch(postData);
    } else {
        processUnmatch(postData);
    }

    console.log(`------------------------ RUN RESULTS ------------------------`);
    console.log(`Match Posts:   ${MatchPostsCount}`);
    console.log(`Unmatch Posts: ${UnmatchPostsCount}`);
    console.log(`------------------------ RUN RESULTS ------------------------`);
}

module.exports = {
    processPost
}