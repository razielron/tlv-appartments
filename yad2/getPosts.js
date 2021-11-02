const axios = require('axios');
const MongoClient = require('../mongodb/mongodbClient');
const TelegramBot = require('node-telegram-bot-api');
const creds = require('../creds');
const config = require('../config');

const mongoClient = new MongoClient();
const bot = new TelegramBot(creds.telegramToken, {polling: true});
let itemCounter = 0;

async function getData() {
    let request = {
        method: 'get',
        url: config.yad2Urls[0]
    }

    let res = await axios(request);

    return res.data.feed.feed_items;
}

function buildPostData(postsArr) {
    let tempPost, remakeArr = [];

    for(let i = 0; i < postsArr.length; i++) {
        if(postsArr[i]['link_token']) {
            tempPost = {
                foundts: new Date(),
                postNum: itemCounter++,
                postUrl: `https://www.yad2.co.il/s/c/${postsArr[i]['link_token']}`,
                price: postsArr[i]['price'],
                street: postsArr[i]['street'],
                rooms: postsArr[i]['Rooms_text']
            }
            remakeArr.push(tempPost);
        }
    }

    return remakeArr;
}

async function filterExistingPosts(postsArr) {
    let isExists, remainArr = [];

    for(let i = 0; i < postsArr.length; i++) {
        isExists = await mongoClient.isUrlExists(config.mongodb.yad2Collection, postsArr[i]['postUrl']);
        if(!isExists.length) remainArr.push(postsArr[i]);
    }

    return remainArr;
}

function sendData(postsArr) {
    let message, postData;

    for(let i = 0; i < postsArr.length; i++) {
        postData = postsArr[i];
        message = `${postData['postNum']}`;
        message += `\nמספר חדרים: ${postData['rooms']}`;
        message += `\nרחוב: ${postData['street']}`;
        message += `\nמחיר: ${postData['price']}`;
        message += `\n${postData['postUrl']}`;

        bot.sendMessage(config.channelId, message, {disable_web_page_preview: true});
    }
}

async function processYad2() {
    try {
        let postsArr = await getData();
        postsArr = buildPostData(postsArr);
        postsArr = await filterExistingPosts(postsArr);
        if(postsArr.length) {
            console.log({postsArr});
            await mongoClient.saveYad2Posts(postsArr);
            sendData(postsArr);
        } else {
            console.log("Nothing New");
        }
    } catch(e) {
        console.log(e);
    }
}

(async () => {
    await processYad2();
})();