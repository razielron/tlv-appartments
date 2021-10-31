const config = require('../config');
const { MongoClient } = require('mongodb');

const client = new MongoClient(config.mongodb.fullUrl);

async function createCollections() {
    await client.connect();
    const db = client.db(config.mongodb.dbName);

    const matchCollection = await db.listCollections({name: config.mongodb.matchCollection}).next();
    if(!matchCollection) await db.createCollection(config.mongodb.matchCollection);

    const unmatchCollection = await db.listCollections({name: config.mongodb.unmatchCollection}).next();
    if(!unmatchCollection) await db.createCollection(config.mongodb.unmatchCollection);

    await client.close();
}

async function getLastPostId(isMatch = true) {
    let connectCollection = isMatch ? config.mongodb.matchCollection : config.mongodb.unmatchCollection;

    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection(connectCollection);
    let queryRes = await collection.find().sort({postNum:-1}).limit(1);
    queryRes = await queryRes.next();
    console.log({queryRes});
    await client.close();
    return queryRes ? queryRes.postNum : 0;
}

async function isUrlExists(collectionName, url) {
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection(collectionName);
    let queryRes = await collection.find({postUrl: url}, { projection: {_id: 1} }).toArray();
    console.log({queryRes});
    await client.close();

    return queryRes;
}

async function getAllText(collectionName) {
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection(collectionName);
    let queryRes = await collection.find({}, { projection: {postText: 1} }).toArray();
    console.log({queryRes})
    await client.close();

    return queryRes;
}

async function saveMatchPost(postData) {
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection(config.mongodb.matchCollection);
    const insertResult = await collection.insertOne(postData);
    console.log({insertResult});
    await client.close();
}

async function saveUnmatchPost(postData) {
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection(config.mongodb.unmatchCollection);
    const insertResult = await collection.insertOne(postData);
    console.log({insertResult});
    await client.close();
}

isUrlExists(config.mongodb.matchCollection, '234')
//saveMatchPost({postNum: 3})
  .then(console.log)
  .catch(console.error);

module.exports = {
    createCollections,
    getLastPostId,
    saveMatchPost,
    saveUnmatchPost,
    isUrlExists,
    getAllText
}