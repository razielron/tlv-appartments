const config = require('../../config');
const stringSimilarity = require("string-similarity");
const MongoClient = require('../../mongodb/mongodbClient');

const mongoClient = new MongoClient();

async function isProcessable(postData) {
    return postData['isContainsPic']
        && containsHebrew(postData['postText'])
        && !(await isAlreadySaved(config.mongodb.matchCollection, postData))
        && !(await isAlreadySaved(config.mongodb.unmatchCollection, postData))
        && !(await isSameSavedText(config.mongodb.matchCollection, postData))
        && !(await isSameSavedText(config.mongodb.unmatchCollection, postData));
}

function containsHebrew(str) {
    return (/[\u0590-\u05FF]/).test(str);
}

async function isAlreadySaved(collectionName, postData) {
    let res = await mongoClient.isUrlExists(collectionName, postData['postUrl']);
    console.log('*********************************************')
    console.log({res})
    console.log('*********************************************')

    return res.length;
}

async function isSameSavedText(collectionName, postData) {
    let similarity = 0;
    let postsTextArr = await mongoClient.getAllText(collectionName);

    for(let i = 0; i < postsTextArr.length; i++) {
        similarity = stringSimilarity.compareTwoStrings(postsTextArr[i].postText, postData.postText);

        if(similarity >= config.postTextSimilarityThreashold) {
            console.log(`Current Post: ${postData.postUrl}`);
            console.log(`Similar to Post: ${postsTextArr[i].postUrl}`);
            console.log(`Similarity Prexentage: ${100 * similarity}%`);
            console.log(`Same text as other post, isMatch: ${postsTextArr[i]['isMatch']}`);
            return true;
        }
    }

    return false;
}

module.exports = {
    isProcessable
}