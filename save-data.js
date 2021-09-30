const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const creds = require('./creds');
const config = require('./config');
const stringSimilarity = require("string-similarity");
const { checkPost, smartSplit, containsHebrew,
    getRoomNum, getSimilarStreets, getStreet,
    getPhoneNumber, getPrice, filterPrice } = require('./filtering/filter');

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

function printResult(postData) {
    let postDataNoText = {};

    for(let key in postData)
        if(key !== 'postText')
        postDataNoText[key] = postData[key];

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log({postDataNoText});
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RESULT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
}

function isRentPost(postData) {
    return (postData['isContainsPic'] && containsHebrew(postData['postText']));
}

function isSameSavedText(matchData, postData) {
    let similarity = 0;

    for(let i = 0; i < matchData.length; i++) {
        similarity = stringSimilarity.compareTwoStrings(matchData[i].postText, postData.postText);

        if(similarity >= config.postTextSimilarityThreashold) {
            console.log(`Similarity Prexentage: ${100 * similarity}%`);
            console.log(`Same text as other post, isMatch: ${matchData[i]['isMatch']}`);
            return true;
        }
    }

    return false;
}

function isAlreadySaved(postsArr, postData) {
    for(let i = 0; i < postsArr.length; i++) {
        if(postsArr[i].postUrl === postData.postUrl) {
            console.log(`Already Saved, isMatch: ${postsArr[i]['isMatch']}`);
            return true;
        }
    }

    return false;
}

function isMatch(postData) {
    let stateArr;

    stateArr = postData['stateArr'];
    postData['isMatch'] = 
        stateArr[stateArr.length - 1]['state'] !== 'q2'
        && filterPrice(postData['price']);

    return postData;
}

function saveDataToFile(filePath, allData, postData) {
    console.log(`Saving post ${postData.postUrl} to ${filePath}`);
    allData.data.push(postData);
    fs.writeFileSync(filePath, JSON.stringify(allData));
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

function fillPostData(postData) {
    postData['stateArr'] = checkPost(postData);
    postData['rooms'] = getRoomNum(postData['stateArr']);
    postData['possibleStreets'] = getStreet(postData['stateArr']);
    postData['matchStreets'] = getSimilarStreets(smartSplit(postData['postText']));
    postData['phone'] = getPhoneNumber(postData['stateArr']);
    postData['price'] = getPrice(postData['stateArr']);
    postData = isMatch(postData);

    return postData;
}

function CheckAndSavePost(postData) {
    let matchData = getDataByFile(config.matchPath);
    let unmatchData = getDataByFile(config.unmatchPath);
    let singleRunMatch = getDataByFile(config.singleRunMatchPath);
    let singleRunUnmatch = getDataByFile(config.singleRunUnmatchPath);

    if(isRentPost(postData)
        && !isAlreadySaved(matchData['data'], postData)
        && !isAlreadySaved(unmatchData['data'], postData)
        && !isSameSavedText(matchData['data'], postData)) {

        postData = fillPostData(postData);
        printResult(postData);

        if(postData['isMatch']) {
            MatchPostsCount++
            sendMatchMessage(postData);
            saveDataToFile(config.matchPath, matchData, postData);
            saveDataToFile(config.singleRunMatchPath, singleRunMatch, postData);
        } else {
            UnmatchPostsCount++;
            saveDataToFile(config.unmatchPath, unmatchData, postData);
            saveDataToFile(config.singleRunUnmatchPath, singleRunUnmatch, postData);
        }
    }

    console.log(`------------------------ RUN RESULTS ------------------------`);
    console.log(`Match Posts:   ${MatchPostsCount}`);
    console.log(`Unmatch Posts: ${UnmatchPostsCount}`);
    console.log(`------------------------ RUN RESULTS ------------------------`);
}

module.exports = {
    isAlreadySaved,
    isMatch,
    CheckAndSavePost,
    deleteBeforeRunFiles
}

let postData = {"postNum":0,"postUrl":"https://www.facebook.com/groups/1611176712488861/posts/3003441243262394/","postText":"Hostel BU93 shared a post.\n7\nt\nc\nS\ne\nh\no\nn\ns\n  ·\nSleeping in a sukkah all week? We have a better plan. Come stay with us only minutes from Gordon Beach to make your holiday that much better. Hostel beds priced at only 69 NIS per night. For a special Sukkot deal: book 10 nights and get 5% off your total booking! Relax on the beach all day and bar hop all night. What's a better way to celebrate??\nCall or text +9720584129266 (English) +9720542227141 (Hebrew) or visit our site to reserve\nישנים כל השבוע בסוכה? יש לנו תוכנית טובה יותר. בוא להישאר איתנו רק דקות מחוף גורדון כדי להפוך את החופשה שלך להרבה יותר טובה. מיטות הוסטל במחיר של 69 ₪ בלבד ללילה. לעסקת סוכות מיוחדת: הזמינו 10 לילות וקבלו 5% הנחה על כל ההזמנה! תירגע על החוף כל היום ובר הופ כל הלילה. איזו דרך טובה יותר לחגוג ??\nהתקשר או שלח הודעה +9720584129266 (אנגלית) +9720542227141 (עברית) או בקר באתרנו להזמין מקום\nLike\nComment\n0 Comments\nWrite a comment…"}
let postData2 = {'postNum': 2, 'postUrl': 'https://www.facebook.com/groups/1611176712488861/posts/3003305009942684/', 'postText': "Orly Saranga\nl\n1\nt\nS\ni\n1\np\nm\nn\ns\nh\no\nr\ne\nd\n  ·\nהתפנה חדר בדירת 3 שותפים הכניסה מיידית\nהדירה נמצאת ברחוב טרומפלדור, דקה מהים!.\nקומה 2 עם מעלית, הדירה  מאובזרת חלקית.\nשכירות 2200₪ לא כולל \nגודל\nחדר קטן \n2.90 אורך\n2.40 רוחב\nבדירה יש 2 חתולים\nואסור להכניס בצל לדירה\nאם את/ה בסביבות 30+ , אוהבים חתולים ומוכנים לוותר על בצל (השותפה אלרגית אז אסור להכניס לדירה בצל)..\nמוזמנים לשלוח *הודעה בלבד* למירב בטלפון 053-270-2377\nהיא מראה את הגירה כל יום בין 19:30 ל-21:30\nThis content isn't available right now\nWhen this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.\nLike\nComment\n0 Comments\nWrite a comment…"}
let postData3 = {'postNum': 7, 'postUrl': 'https://www.facebook.com/groups/101875683484689/posts/1579369019068677/', 'postText': 'Joni Yehuda Eilati\n2\no\nh\nn\nh\ns\no\nd\n  ·\nלמה אין תנאי כזה שמי שלא מפרסם מחיר ומיקום מורידים לו את הפוסט? לא ברור.\n157\n157\n27 Comments\nLike\nComment\n27 Comments\nView 8 more comments\nAll Comments\nיוסי אזולאי\n2 חדרים 4700 כולל ארנונה בפלורנטין\nארבבנאל 66\nכניסה ב1.10\nLike\n · Reply · 55m\nItamar Gortzak\nלמה 10 שנים אחרי המחאה החברתית הכי גדולה שהייתה במדינה עדיין לא השתנה מספיק בשביל שנצא מהמצוקה ואנחנו עדיין שותקים על זה..?\n2\nLike\n · Reply · 18m\nActive\n\nWrite a comment…'}
let postData4 = {"postNum": 6,"postUrl": "https://www.facebook.com/groups/35819517694/posts/10158657594547691/","postText": "אדיר כהן shared a post.\n1\nt\nl\np\n2h\nn\nu\nr\ne\no\n  ·\nדירה להשכרה ברחוב אבא הלל סילבר 41\nחדר ומרפסת סגורה\nקומת כניסה ללא מדרגות בכלל\nכניסה ראשונה מתוך 4\nמיקום מרכזי\nסופר , קופת חולים וכל מה שרק צריך במרחק הליכה מהבית\nללא עמלת תיווך\nעבר שיפוץ חלקי \nמזגן חדש \nתריסים חשמליים פלוס רשתות\nיש ריהוט חלקי בדירה\nחנייה בשפע\nותחנת אוטובוס במרחק דקה הליכה\nקרוב לטכניון\nמחיר כזה לא שמעתם\n!\nמספר טלפון - 0546490306\n+3\nאדיר כהן\n1\nt\nl\np\n2h\nn\nu\nr\ne\no\n  ·\nדירה להשכרה בחיפה ברחוב אבא הלל סילבר 41\nחדר ומרפסת סגורה\nקומת כניסה ללא מדרגות בכלל\nכניסה ראשונה מתוך 4\nמיקום מרכזי\n… See More\n1\n1\n1 Comment\nLike\nComment\n1 Comment\nAll Comments\nVan Dam\nמחיר?\nLike\n · Reply · 14m\nActive\n\nWrite a comment…"}
let postData5 = {"postNum": 3,"postUrl": "https://www.facebook.com/groups/35819517694/posts/10158656894707698/","postText": "Meir Golan\nYe\nl\ns\nS\nt\nS\nte\nl\nr\nd\nr\nh\nda\nr\nn\ns\na\ny at\nf\nm\n 9\na\n:19\ne\nh\na\n A\ns\nM\n  ·\nלהשכרה:\nרחוב סר ג'ון מונש 9\nדירה, יד אליהו, תל אביב יפו\n3 חדרים, קומה 2, 64 מ\"ר\nלא לשותפים. ללא תווך. שני חדרי שינה גדולים. רחוב שקט עם נוף פתוח למרחקים. בסביבה גני ילדים ובתי ספר יסודיים. מרחק הליכה לקווי תחבורה ציבוריים. חניה משותפת חופשית בבניין. שני כיווני אויר. חדר השירותים מופרד מחדר האמבטיה. דוד שמש. מכוון שהנכס עדיין מושכר, הכניסה תהיה ב-1/10/2021. ניתן לרכוש ריהוט מהדיירים היוצאים\n* תאריך כניסה 01/10/2021\n* ועד בית (לחודש) 50 ₪\n* מרפסות 2\n* קומות בבנין 4\n* מס תשלומים 12\n* ארנונה לחודשיים 400 ₪\n* חניות 1\n* מזגן בכל חדר, לטווח ארוך\n* 5000 שח\n* יוסי - 054-2184222\n+2\n3 Comments\nLike\nComment\n3 Comments\nAll Comments\nNiki Hill\nYisca Tolidano\nLike\n · Reply · 6h\nNoga Shafrir\nMichal Haleviy\nLike\n · Reply · 17m\n1 Reply\nActive\n\nWrite a comment…"}
let postData6 = {"postNum": 12,"postUrl": "https://www.facebook.com/groups/101875683484689/posts/1580981338907446/","postText": "·\nאני מראה את הדירה עכשיו. אם היא לא תהיה רלוונטית אני אוריד את הפוסט. מוזמנים לבוא ולעשות סיבוב.\nמפנה דירת 3 חדרים, משופצת, ב7500 ש״ח. הדירה בארבע ארצות 3, דירה 6 מתאימה לשותפים או לזוג + ילד. קומה שניה ללא מעלית.\nארנונה כ400 ש״ח לחודשיים, ועד 150 ש״ח לחודש, כניסה ב1 באוקטובר.\nבדירה כיריים גז, בלי תנור, מקלחת קטנה במצב סביר, חיבור למכונת כביסה וכו׳. מזגן בכל חדר + חדש בסלון.\nצריך לחתימה: שני ערבים, צ׳קים מראש לשנה. אני לא הייתי צריך ערבות בנקאית, אבל יתכן והשוכר החדש יצטרך.\nהבעלים בגדול מסדר עניינים כשצריך, ולא מציק.\nקריטי לו קצת במה השוכרים עובדים או מה הם עושים, אז כשאתם יוצרים קשר בבקשה:\nשמות וגילאים של מי שבחוזה הדירה, משכורת (בערך) .\nאנחנו מוכרים 2 ארונות, מיטה עם מזרון, פינת אוכל ועוד טיפלה דברים.\nליצירת קשר:\nואטס אפ עדיף - 052-2953970\nאוהד\n+6\n3\n3\n43 Comments\n","isContainsPic": true}
let postData7 = {
    "postNum": 0,
    "postUrl": "https://www.facebook.com/groups/101875683484689/posts/158283171872241/",
    "postText": "·\nללא תיווך\nברחוב שמשון ליד הסנטר\nדירת fdsgשלושה חדרים, 3 מרפסות (אחת סגורה)\nקומה שלישית ללא \n75 מר\nאמבטיה ומטבח משופצים\nשכד הוא 6300 לחצי שנה ואחכ יעלה\n+2\n7\n7\n70 Comments\n",
    "isContainsPic": true}
// isMatch(postData2);
// isMatchPy(postData2);
 CheckAndSavePost(postData7);
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