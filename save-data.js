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

    if(fs.existsSync(data.singlePostResultPath)) {
        fs.unlinkSync(data.singlePostResultPath);
    }

    fs.writeFileSync(data.singlePostPath, JSON.stringify(postData));

    exec(`py ${data.pythonScriptSinglePost}`, null);
    exec(`python ${data.pythonScriptSinglePost}`, null);
    
    console.log(`Waiting for file: ${data.singlePostResultPath}`)
    while(!fs.existsSync(data.singlePostResultPath)) {
        syncWait(5000);
    }

    let result = fs.readFileSync(data.singlePostResultPath, 'utf8');
    result = JSON.parse(result);
    result = result['result'];

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log({ postUrl: postData.postUrl, isMatch: result });
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    if(!result) {
        if(fs.existsSync(data.unmatchPath)) {
            unmatchData = fs.readFileSync(data.unmatchPath, 'utf8');
            unmatchData = JSON.parse(unmatchData);
        }

        unmatchData.unmatchPosts.push(postData);
        fs.writeFileSync(data.unmatchPath, JSON.stringify(unmatchData));
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

// postData = {"postNum":0,"postUrl":"https://www.facebook.com/groups/1611176712488861/posts/3003441243262394/","postText":"Hostel BU93 shared a post.\n7\nt\nc\nS\ne\nh\no\nn\ns\n  ·\nSleeping in a sukkah all week? We have a better plan. Come stay with us only minutes from Gordon Beach to make your holiday that much better. Hostel beds priced at only 69 NIS per night. For a special Sukkot deal: book 10 nights and get 5% off your total booking! Relax on the beach all day and bar hop all night. What's a better way to celebrate??\nCall or text +9720584129266 (English) +9720542227141 (Hebrew) or visit our site to reserve\nישנים כל השבוע בסוכה? יש לנו תוכנית טובה יותר. בוא להישאר איתנו רק דקות מחוף גורדון כדי להפוך את החופשה שלך להרבה יותר טובה. מיטות הוסטל במחיר של 69 ₪ בלבד ללילה. לעסקת סוכות מיוחדת: הזמינו 10 לילות וקבלו 5% הנחה על כל ההזמנה! תירגע על החוף כל היום ובר הופ כל הלילה. איזו דרך טובה יותר לחגוג ??\nהתקשר או שלח הודעה +9720584129266 (אנגלית) +9720542227141 (עברית) או בקר באתרנו להזמין מקום\nLike\nComment\n0 Comments\nWrite a comment…"}
// isMatch(postData);
// saveToFile(postData)

module.exports = {
    isAlreadySaved,
    isMatch,
    saveToFile
}