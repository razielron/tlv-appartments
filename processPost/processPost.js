const TelegramBot = require('node-telegram-bot-api');
const creds = require('../creds');
const config = require('../config');
const { isProcessable } = require('./filtering/preFiltering');
const { isMatch } = require('./filtering/postFiltering');
const { processText } = require('./processText/processText');
const MongoClient = require('../mongodb/mongodbClient');

const mongoClient = new MongoClient();
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

async function processMatch(postData) {
    MatchPostsCount++;
    postData['postNum'] = await mongoClient.getLastPostId(true) + 1;
    sendMatchMessage(postData);
    await mongoClient.saveMatchPost(postData);
}

async function processUnmatch(postData) {
    UnmatchPostsCount++;
    postData['postNum'] = await mongoClient.getLastPostId(false) + 1;
    await mongoClient.saveUnmatchPost(postData);
}

async function processPost(postData) {
    let preFiltering = await isProcessable(postData);

    if(!preFiltering) {
        return console.log('Prefiltering: True');
    }
    
    postData['runts'] = global.runts;
    postData = processText(postData);
    postData['isMatch'] = isMatch(postData);

    if(postData['isMatch']['isAllMatch']) {
        await processMatch(postData);
    } else {
        await processUnmatch(postData);
    }

    console.log(`------------------------ RUN RESULTS ------------------------`);
    console.log(`Match Posts:   ${MatchPostsCount}`);
    console.log(`Unmatch Posts: ${UnmatchPostsCount}`);
    console.log(`------------------------ RUN RESULTS ------------------------`);
}

module.exports = {
    processPost
}