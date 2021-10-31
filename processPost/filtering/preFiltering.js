const config = require('../../config');
const stringSimilarity = require("string-similarity");
const { isUrlExists, getAllText } = require('../../mongodb/mongodbClient');

async function isProcessable(postData) {
    return postData['isContainsPic']
        && containsHebrew(postData['postText'])
        && !isAlreadySaved(config.mongodb.matchCollection, postData)
        && !isAlreadySaved(config.mongodb.unmatchCollection, postData)
        && !isSameSavedText(config.mongodb.matchCollection, postData)
        && !isSameSavedText(config.mongodb.unmatchCollection, postData);
}

function containsHebrew(str) {
    return (/[\u0590-\u05FF]/).test(str);
}

async function isAlreadySaved(collectionName, postData) {
    let res = await isUrlExists(collectionName, postData['postUrl']);

    return res.length;
}

async function isSameSavedText(collectionName, postData) {
    let similarity = 0;
    let postsTextArr = await getAllText(collectionName);

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