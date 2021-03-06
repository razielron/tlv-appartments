module.exports = {
    channelId: '@app2ofri',
    matchPath: 'ofriMatch.json',
    unmatchPath: 'ofriUnmatch.json',
    singleRunMatchPath: 'singleRunMatch.json',
    singleRunUnmatchPath: 'singleRunUnmatch.json',
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
        rooms: [4, 4],
        price: [8000, 9000],
        femaleRoommate: false,
        maleRoommate: false,
        sablet: false,
        studio: false,
        unit: false
    }
}