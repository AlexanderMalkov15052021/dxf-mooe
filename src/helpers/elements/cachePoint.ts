export const cachePoint = (
    lastId: number, pointX: number, pointY: number, angle: number, zoneName: string
) => {

    return {
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": `${zoneName}`,  // A603col01row21
        "mLaneMarkID": lastId,
        "mLaneMarkName": `${zoneName}`,  // A603col01row21
        "mLaneMarkSize": {
            "height": 0,
            "length": 0,
            "width": 0
        },
        "mLaneMarkType": 9,
        "mLaneMarkWidth": 0.3,
        "mLaneMarkXYZW": {
            "w": Math.cos(angle / 2),
            "x": pointX,
            "y": pointY,
            "z": Math.sin(angle / 2)
        },
        "neighborsID": []
    }
}