const config = require('../../config');
const stringSimilarity = require("string-similarity");

function isProcessable(postData, matchPostsArr, unmatchPostsArr) {
    return postData['isContainsPic']
        && containsHebrew(postData['postText'])
        && !isAlreadySaved(matchPostsArr, postData)
        && !isAlreadySaved(unmatchPostsArr, postData)
        && !isSameSavedText(matchPostsArr, postData)
        && !isSameSavedText(unmatchPostsArr, postData);
}

function containsHebrew(str) {
    return (/[\u0590-\u05FF]/).test(str);
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

function isSameSavedText(matchData, postData) {
    let similarity = 0;

    for(let i = 0; i < matchData.length; i++) {
        similarity = stringSimilarity.compareTwoStrings(matchData[i].postText, postData.postText);

        if(similarity >= config.postTextSimilarityThreashold) {
            console.log(`Current Post: ${postData.postUrl}`);
            console.log(`Similar to Post: ${matchData[i].postUrl}`);
            console.log(`Similarity Prexentage: ${100 * similarity}%`);
            console.log(`Same text as other post, isMatch: ${matchData[i]['isMatch']}`);
            return true;
        }
    }

    return false;
}

module.exports = {
    isProcessable
}