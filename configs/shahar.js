module.exports = {
    channelId: '@tlv_apartments',
    streetsDataPath: 'streetsData.json',
    groups: [
        'https://www.facebook.com/groups/403787519759673',
        'https://www.facebook.com/groups/1611176712488861',
        'https://www.facebook.com/groups/1196843027043598',
        'https://www.facebook.com/groups/423017647874807',
        'https://www.facebook.com/groups/101875683484689',
        'https://www.facebook.com/groups/35819517694',
        'https://www.facebook.com/groups/secretapartmentstelaviv',
        'https://www.facebook.com/groups/365588344194085',
        'https://www.facebook.com/groups/141136760102682',
        'https://www.facebook.com/groups/429827780505313',
        'https://www.facebook.com/groups/1427929940815001',
        'https://www.facebook.com/groups/287564448778602'
    ],
    postsPerGroup: 15,
    streetSimilarityThreashold: 0.8,
    postTextSimilarityThreashold: 0.8,
    startState: 'q0',
    endSate: 'qx',
    automatonToDataConfig: {
        q3: { prop: 'rooms', dataIndex: -1 },
        q14: { prop: 'price', dataIndex: 0 },
        q15: { prop: 'street', dataIndex: 1 },
        q13: { prop: 'phone', dataIndex: 0 },
        q5: { prop: 'roommate', dataIndex: 0 },
        q9: { prop: 'femaleRoommate', dataIndex: 0 },
        q18: { prop: 'maleRoommate', dataIndex: 0 },
        q16: { prop: 'sablet', dataIndex: 0 },
        q7: { prop: 'studio', dataIndex: 0 },
        q8: { prop: 'unit', dataIndex: 0 }
    },
    filters: {
        rooms: [3, 4],
        price: [1500, 3300],
        maleRoommate: true,
        sablet: false,
        studio: false,
        unit: false
    },
    yad2: {
        apis: [
            'https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent?topArea=2&area=1&city=5000&neighborhood=1461&property=1&rooms=3-3.5&price=6000-8000&forceLdLoad=true'
        ],
        urls: [
            'https://www.yad2.co.il/realestate/rent?topArea=2&area=1&city=5000&neighborhood=1461&property=1&rooms=3-3.5&price=6001-9000'
        ],
        devtoolsApiSearch: [
            'https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent?'
        ]
    },
    mongodb: {
        fullUrl: 'mongodb://rootuser:rootpass@mongodb:27017',
        url: 'mongodb://mongodb:27017',
        dbName: 'tlvaptbot',
        matchCollection: 'shaharMatch',
        unmatchCollection: 'shaharUnmatch',
        yad2Collection: 'shaharYad2',
        userName: 'rootuser',
        password: 'rootpass'
    }
}