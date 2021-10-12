const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const creds = require('../creds');
const config = require('../config');
const { isProcessable } = require('./filtering/preFiltering');
const { isMatch } = require('./filtering/postFiltering');
const { processText } = require('./processText/processText')

const bot = new TelegramBot(creds.telegramToken, {polling: true});
let MatchPostsCount = 0, UnmatchPostsCount = 0;

function deleteBeforeRunFiles() {
    deleteFile(config.singleRunMatchPath);
    deleteFile(config.singleRunUnmatchPath);
}

function deleteFile(path) {
    if(fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

function getDataByFile(path) {
    let allData = { data: [] };

    if(fs.existsSync(path)) {
        allData = fs.readFileSync(path, 'utf8');
        allData = JSON.parse(allData);
    }

    return allData;
}

function saveDataToFile(filePath, allData, postData) {
    console.log(`Saving post ${postData.postUrl} to ${filePath}`);
    allData.data.push(postData);
    fs.writeFileSync(filePath, JSON.stringify(allData));
}

function printResult(postData) {
    let postDataNoText = {};

    for(let key in postData)
        if(key !== 'postText')
        postDataNoText[key] = postData[key];

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log({postDataNoText});
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
}

function sendMatchMessage(postData) { 
    let message = `${MatchPostsCount}`;
    message += `\nמספר חדרים: ${postData.rooms}`;
    message += `\nרחובות אפשריים: ${postData.possibleStreets}`;
    message += `\nהתאמת רחובות: ${postData.matchStreets}`;
    message += `\nמחיר: ${postData.price}`;
    message += `\nטלפון: ${postData.phone}`;
    message += `\n${postData.postUrl}`;

    bot.sendMessage(config.channelId, message, {disable_web_page_preview: true});
}

function unmatchProcess(postData) {
    let unmatchData = getDataByFile(config.unmatchPath);
    let singleRunUnmatch = getDataByFile(config.singleRunUnmatchPath);

    UnmatchPostsCount++;
    saveDataToFile(config.unmatchPath, unmatchData, postData);
    saveDataToFile(config.singleRunUnmatchPath, singleRunUnmatch, postData);
}

function matchProcess(postData) {
    let matchData = getDataByFile(config.matchPath);
    let singleRunMatch = getDataByFile(config.singleRunMatchPath);

    MatchPostsCount++
    sendMatchMessage(postData);
    saveDataToFile(config.matchPath, matchData, postData);
    saveDataToFile(config.singleRunMatchPath, singleRunMatch, postData);
}

function processPost(postData) {
    let matchData = getDataByFile(config.matchPath);
    let unmatchData = getDataByFile(config.unmatchPath);
    let singleRunMatch = getDataByFile(config.singleRunMatchPath);
    let singleRunUnmatch = getDataByFile(config.singleRunUnmatchPath);

    if(!isProcessable(postData)) 
        return unmatchProcess(postData);
        
    postData = processText(postData);
    postData['isMatch'] = isMatch(postData);

    if(postData['isMatch']['isAllMatch']) {
        matchProcess(postData);
    } else {
        unmatchProcess(postData);
    }

    console.log(`------------------------ RUN RESULTS ------------------------`);
    console.log(`Match Posts:   ${MatchPostsCount}`);
    console.log(`Unmatch Posts: ${UnmatchPostsCount}`);
    console.log(`------------------------ RUN RESULTS ------------------------`);
}