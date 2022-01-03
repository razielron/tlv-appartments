const axios = require('axios');
const MongoClient = require('../mongodb/mongodbClient');
const TelegramBot = require('node-telegram-bot-api');
const creds = require('../creds');
const config = require('../config');

const mongoClient = new MongoClient();
const bot = new TelegramBot(creds.telegramToken, {polling: true});

async function getDataByApi() {
    let request = {
        method: 'get',
        url: config.yad2.apis[0]
    }

    let res = await axios(request);

    return res.data.feed.feed_items;
}

async function buildPostData(postsArr) {
    let tempPost, remakeArr = [];
    let lastPostNum = await mongoClient.getLastPostId(config.mongodb.yad2Collection);

    for(let i = 0; i < postsArr.length; i++) {
        let nowts = new Date();

        if(postsArr[i]['link_token']) {
            tempPost = {
                foundts: nowts,
                postNum: ++lastPostNum,
                postId: postsArr[i]['id'],
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

async function removeDuplicates(postsArr) {
    let dict = {}, postsNoDupArr = [];

    for(let i = 0; i < postsArr.length; i++) {
        dict[postsArr[i]['postId']] = i;
    }

    for (const [key, value] of Object.entries(dict)) {
        postsNoDupArr.push(postsArr[value]);
    }
    //console.log({postsNoDupArr})
    return postsNoDupArr;
}

async function filterExistingPosts(postsArr) {
    let isExists, remainArr = [];

    for(let i = 0; i < postsArr.length; i++) {
        isExists = await mongoClient.isIdExists(config.mongodb.yad2Collection, postsArr[i]['postId']);
        if(!isExists.length) remainArr.push(postsArr[i]);
    }

    return remainArr;
}

function sendData(postsArr) {
    let message, postData;
    
    postsArr.sort((post1, post2) => { return post1['postNum'] - post2['postNum']; });

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

async function processYad2(postsArr) {
    try {
        //let postsArr = await getDataByApi();
        postsArr = await buildPostData(postsArr);
        postsArr = await filterExistingPosts(postsArr);
        postsArr = await removeDuplicates(postsArr);

        if(postsArr.length) {
            console.log({postsArr});
            await mongoClient.saveYad2Posts(postsArr);
            sendData(postsArr);
        } else {
            console.log("Nothing New");
        }
    } catch(e) {
        console.log(e);
        bot.sendMessage(config.channelId, `Yad2\n${e}`);
    }
}

/* (async () => {
    await processYad2();
})(); */

module.exports = {
    processYad2
}