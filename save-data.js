const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const creds = require('./creds');
const data = require('./config');
const filters = require('./filtering/filters.json');
const { match, checkPost, smartSplit } = require('./filtering/filter');
const { isStreet } = require('./govData');

const bot = new TelegramBot(creds.telegramToken, {polling: true});
let MatchPostsCount = 0, UnmatchPostsCount = 0;

const syncWait = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}

function printResults(postData) {
    let postDataNoText = {};

    for(let key in postData)
        if(key !== 'postText')
        postDataNoText[key] = postData[key];

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log({postDataNoText});
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
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
    let result = checkPost(postData);

    postData['stateArr'] = result;
    postData['isMatch'] = result[result.length - 1]['state'] !== 'q2';

    return postData;
}

function getRoomNum(stateArr) {
    let roomIndicators = ["חדרים"];

    for(let i = 1; i < stateArr.length; i++) {
        if(roomIndicators.some(indicator => match(stateArr[i]['matchedWord'], indicator))) {
            return stateArr[i - 1]['matchedWord'];
        }
    }

    return undefined;
}

function compareStreets(postTextArr) {
    let match, matchStreets = [];

    for(let i = 0; i < postTextArr.length; i++) {
        if(match = isStreet(postTextArr[i])) {
            matchStreets.push(match);
        }
    }

    return matchStreets;
}

function getStreet(stateArr) {
    let streetIndicators = ["רחוב"];
    let result = [];

    for(let i = 1; i < stateArr.length; i++) {
        if(streetIndicators.some(indicator => match(stateArr[i]['matchedWord'], indicator))) {
            result.push(stateArr[i + 1]['matchedWord']);
        }
    }

    return result;
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

function sendMatchMessage(postData) { 
    let message = `${MatchPostsCount}`;
    message += `\nמספר חדרים: ${postData.rooms || '-'}`;
    message += `\nרחובות אפשריים: ${postData.possibleStreets}`;
    message += `\nהתאמת רחובות: ${postData.matchStreets}`;
    message += `\n${postData.postUrl}`;

    bot.sendMessage(data.channelId, message, {disable_web_page_preview: true});
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
        postData = isMatch(postData);
        postData['rooms'] = getRoomNum(postData['stateArr']);
        postData['possibleStreets'] = getStreet(postData['stateArr']);
        postData['matchStreets'] = compareStreets(smartSplit(postData['postText']));
        printResults(postData);

        if(postData['isMatch']) {
            MatchPostsCount++
            sendMatchMessage(postData);
            saveMatch(allData, postData);
        } else {
            UnmatchPostsCount++;
            saveUnmatch(unmatchData, postData);
        }
    }

    console.log(`Match Posts:   ${MatchPostsCount}`);
    console.log(`Unmatch Posts: ${UnmatchPostsCount}`);
}

module.exports = {
    isAlreadySaved,
    isMatch,
    CheckAndSavePost
}

let postData = {"postNum":0,"postUrl":"https://www.facebook.com/groups/1611176712488861/posts/3003441243262394/","postText":"Hostel BU93 shared a post.\n7\nt\nc\nS\ne\nh\no\nn\ns\n  ·\nSleeping in a sukkah all week? We have a better plan. Come stay with us only minutes from Gordon Beach to make your holiday that much better. Hostel beds priced at only 69 NIS per night. For a special Sukkot deal: book 10 nights and get 5% off your total booking! Relax on the beach all day and bar hop all night. What's a better way to celebrate??\nCall or text +9720584129266 (English) +9720542227141 (Hebrew) or visit our site to reserve\nישנים כל השבוע בסוכה? יש לנו תוכנית טובה יותר. בוא להישאר איתנו רק דקות מחוף גורדון כדי להפוך את החופשה שלך להרבה יותר טובה. מיטות הוסטל במחיר של 69 ₪ בלבד ללילה. לעסקת סוכות מיוחדת: הזמינו 10 לילות וקבלו 5% הנחה על כל ההזמנה! תירגע על החוף כל היום ובר הופ כל הלילה. איזו דרך טובה יותר לחגוג ??\nהתקשר או שלח הודעה +9720584129266 (אנגלית) +9720542227141 (עברית) או בקר באתרנו להזמין מקום\nLike\nComment\n0 Comments\nWrite a comment…"}
let postData2 = {'postNum': 2, 'postUrl': 'https://www.facebook.com/groups/1611176712488861/posts/3003305009942684/', 'postText': "Orly Saranga\nl\n1\nt\nS\ni\n1\np\nm\nn\ns\nh\no\nr\ne\nd\n  ·\nהתפנה חדר בדירת 3 שותפים הכניסה מיידית\nהדירה נמצאת ברחוב טרומפלדור, דקה מהים!.\nקומה 2 עם מעלית, הדירה  מאובזרת חלקית.\nשכירות 2200₪ לא כולל \nגודל\nחדר קטן \n2.90 אורך\n2.40 רוחב\nבדירה יש 2 חתולים\nואסור להכניס בצל לדירה\nאם את/ה בסביבות 30+ , אוהבים חתולים ומוכנים לוותר על בצל (השותפה אלרגית אז אסור להכניס לדירה בצל)..\nמוזמנים לשלוח *הודעה בלבד* למירב בטלפון 053-270-2377\nהיא מראה את הגירה כל יום בין 19:30 ל-21:30\nThis content isn't available right now\nWhen this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.\nLike\nComment\n0 Comments\nWrite a comment…"}
let postData3 = {'postNum': 7, 'postUrl': 'https://www.facebook.com/groups/101875683484689/posts/1579369019068677/', 'postText': 'Joni Yehuda Eilati\n2\no\nh\nn\nh\ns\no\nd\n  ·\nלמה אין תנאי כזה שמי שלא מפרסם מחיר ומיקום מורידים לו את הפוסט? לא ברור.\n157\n157\n27 Comments\nLike\nComment\n27 Comments\nView 8 more comments\nAll Comments\nיוסי אזולאי\n2 חדרים 4700 כולל ארנונה בפלורנטין\nארבבנאל 66\nכניסה ב1.10\nLike\n · Reply · 55m\nItamar Gortzak\nלמה 10 שנים אחרי המחאה החברתית הכי גדולה שהייתה במדינה עדיין לא השתנה מספיק בשביל שנצא מהמצוקה ואנחנו עדיין שותקים על זה..?\n2\nLike\n · Reply · 18m\nActive\n\nWrite a comment…'}
// isMatch(postData2);
// isMatchPy(postData2);
// CheckAndSavePost(postData3);
let stateArr = [
    {
      "state": "q0",
      "matchedWord": ""
    },
    {
      "state": "q6",
      "matchedWord": "3"
    },
    {
      "state": "q0",
      "matchedWord": "·"
    },
    {
      "state": "q10",
      "matchedWord": "רחוב:"
    },
    {
      "state": "q0",
      "matchedWord": "מאיר"
    },
    {
      "state": "q7",
      "matchedWord": "4"
    },
    {
      "state": "q2",
      "matchedWord": "חדרים"
    }
  ]
// console.log(getStreet(stateArr));
// console.log(getRoomNum(stateArr));