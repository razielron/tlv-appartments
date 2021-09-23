const fs = require('fs');
const creds = require('./creds');
const data = require('./data');
const TelegramBot = require('node-telegram-bot-api');
const {PythonShell} = require('python-shell');
const { result } = require('lodash');
const { exec } = require("child_process");

const bot = new TelegramBot(creds.telegramToken, {polling: true});

const syncWait = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}

function isAlreadySaved(allData, postData) {
    for(let i = 0; i < allData.length; i++) {
        if(allData[i].postUrl === postData.postUrl) {
            console.log(`Already Saved, isMatch: ${postData['isMatch']}`);
            return true;
        }
    }

    return false;
}

function isMatch(postData) {
    const maxSec = 10;
    let i = 0;

    if(fs.existsSync(data.singlePostResultPath)) {
        fs.unlinkSync(data.singlePostResultPath);
    }

    fs.writeFileSync(data.singlePostPath, JSON.stringify(postData));

    exec(`py ${data.pythonScriptSinglePost}`, null);
    exec(`python ${data.pythonScriptSinglePost}`, null);
    
    console.log(`Waiting for file: ${data.singlePostResultPath}`)
    while(i != maxSec && !fs.existsSync(data.singlePostResultPath)) {
        syncWait(1000);
        i++;
    }

    if(!fs.existsSync(data.singlePostResultPath)) {
        console.log(`Filtering script didn't create result.json file after ${maxSec} sec for Post: ${postData.postUrl}`);
        return postData;
    }

    let result = fs.readFileSync(data.singlePostResultPath, 'utf8');
    result = JSON.parse(result);

    postData['state_arr'] = result['state_arr'];
    postData['isMatch'] = result['isMatch'];
    
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log({postData});
    console.log({post_url: postData.postUrl, ...result});
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    return postData;
}

function saveUnmatch(unmatchData, postData) {
    console.log(`Saving Unmacthed post: ${postData.postUrl}`);
    unmatchData.unmatchPosts.push(postData);
    fs.writeFileSync(data.unmatchPath, JSON.stringify(unmatchData));
}

function saveMatch(allData, postData) {
    console.log(`Saving Macthed post: ${postData.postUrl}`);
    allData.postsData.push(postData);
    fs.writeFileSync(data.allDataPath, JSON.stringify(allData));
}

function sendMatchData(postData) {
    bot.sendMessage(data.channelId, postData.postUrl, {disable_web_page_preview: true});
}

function CheckAndSavePost(postData) {
    let allData = { postsData: [] };
    let unmatchData = { unmatchPosts: [] };


    if(fs.existsSync(data.allDataPath)) {
        allData = fs.readFileSync(data.allDataPath, 'utf8');
        allData = JSON.parse(allData);
    }

    if(fs.existsSync(data.unmatchPath)) {
        unmatchData = fs.readFileSync(data.unmatchPath, 'utf8');
        unmatchData = JSON.parse(unmatchData);
    }

    if(!isAlreadySaved(allData['postsData'], postData) && !isAlreadySaved(unmatchData['unmatchPosts'], postData)) {
        postData = isMatch(postData)

        if(postData['isMatch']) {
            sendMatchData(postData);
            saveMatch(allData, postData);
        } else {
            saveUnmatch(unmatchData, postData);
        }
    }
}

postData = {"postNum":0,"postUrl":"https://www.facebook.com/groups/1611176712488861/posts/3003441243262394/","postText":"Hostel BU93 shared a post.\n7\nt\nc\nS\ne\nh\no\nn\ns\n  ·\nSleeping in a sukkah all week? We have a better plan. Come stay with us only minutes from Gordon Beach to make your holiday that much better. Hostel beds priced at only 69 NIS per night. For a special Sukkot deal: book 10 nights and get 5% off your total booking! Relax on the beach all day and bar hop all night. What's a better way to celebrate??\nCall or text +9720584129266 (English) +9720542227141 (Hebrew) or visit our site to reserve\nישנים כל השבוע בסוכה? יש לנו תוכנית טובה יותר. בוא להישאר איתנו רק דקות מחוף גורדון כדי להפוך את החופשה שלך להרבה יותר טובה. מיטות הוסטל במחיר של 69 ₪ בלבד ללילה. לעסקת סוכות מיוחדת: הזמינו 10 לילות וקבלו 5% הנחה על כל ההזמנה! תירגע על החוף כל היום ובר הופ כל הלילה. איזו דרך טובה יותר לחגוג ??\nהתקשר או שלח הודעה +9720584129266 (אנגלית) +9720542227141 (עברית) או בקר באתרנו להזמין מקום\nLike\nComment\n0 Comments\nWrite a comment…"}
postData2 = {'postNum': 2, 'postUrl': 'https://www.facebook.com/groups/1611176712488861/posts/3003305009942684/', 'postText': "Orly Saranga\nl\n1\nt\nS\ni\n1\np\nm\nn\ns\nh\no\nr\ne\nd\n  ·\nהתפנה חדר בדירת 3 שותפים הכניסה מיידית\nהדירה נמצאת ברחוב טרומפלדור, דקה מהים!.\nקומה 2 עם מעלית, הדירה  מאובזרת חלקית.\nשכירות 2200₪ לא כולל \nגודל\nחדר קטן \n2.90 אורך\n2.40 רוחב\nבדירה יש 2 חתולים\nואסור להכניס בצל לדירה\nאם את/ה בסביבות 30+ , אוהבים חתולים ומוכנים לוותר על בצל (השותפה אלרגית אז אסור להכניס לדירה בצל)..\nמוזמנים לשלוח *הודעה בלבד* למירב בטלפון 053-270-2377\nהיא מראה את הגירה כל יום בין 19:30 ל-21:30\nThis content isn't available right now\nWhen this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.\nLike\nComment\n0 Comments\nWrite a comment…"}
// isMatch(postData2);
// CheckAndSavePost(postData2);

module.exports = {
    isAlreadySaved,
    isMatch,
    CheckAndSavePost
}