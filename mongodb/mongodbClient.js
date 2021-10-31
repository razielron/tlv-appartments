const config = require('../config');
const { MongoClient } = require('mongodb');

class MongodbClient {
    constructor() {
        this.client = new MongoClient(config.mongodb.fullUrl);
    }

    async createCollections() {
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
    
        const matchCollection = await db.listCollections({name: config.mongodb.matchCollection}).next();
        if(!matchCollection) await db.createCollection(config.mongodb.matchCollection);
    
        const unmatchCollection = await db.listCollections({name: config.mongodb.unmatchCollection}).next();
        if(!unmatchCollection) await db.createCollection(config.mongodb.unmatchCollection);
    
        await this.client.close();
    }
    
    async getLastPostId(isMatch = true) {
        let connectCollection = isMatch ? config.mongodb.matchCollection : config.mongodb.unmatchCollection;
    
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
        const collection = db.collection(connectCollection);
        let queryRes = await collection.find().sort({postNum:-1}).limit(1);
        queryRes = await queryRes.next();
        //console.log({queryRes});
        await this.client.close();
        return queryRes ? queryRes.postNum : 0;
    }
    
    async isUrlExists(collectionName, url) {
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
        const collection = db.collection(collectionName);
        let queryRes = await collection.find({postUrl: url}, { projection: {_id: 1} }).toArray();
        //console.log({queryRes});
        await this.client.close();
    
        return queryRes;
    }
    
    async getAllText(collectionName) {
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
        const collection = db.collection(collectionName);
        let queryRes = await collection.find({}, { projection: {postText: 1} }).toArray();
        //console.log({queryRes})
        await this.client.close();
    
        return queryRes;
    }
    
    async saveMatchPost(postData) {
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
        const collection = db.collection(config.mongodb.matchCollection);
        const insertResult = await collection.insertOne(postData);
        //console.log({insertResult});
        await this.client.close();
    }
    
    async saveUnmatchPost(postData) {
        await this.client.connect();
        const db = this.client.db(config.mongodb.dbName);
        const collection = db.collection(config.mongodb.unmatchCollection);
        const insertResult = await collection.insertOne(postData);
        //console.log({insertResult});
        await this.client.close();
    }
}

module.exports = MongodbClient;