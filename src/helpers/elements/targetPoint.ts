export const targetPoint = (
    lastId: number, pointX: number, pointY: number, angle: number, zoneName: string
) => {

    return {
        "mAvoidPointID": null,
        "mBindRoadGroups": [],
        "mID": null,
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": `A${zoneName}`,  // A603col01row21
        "mLaneMarkID": lastId,
        "mLaneMarkName": `A${zoneName}`,  // A603col01row21
        "mLaneMarkSize": {
            "height": 0,
            "length": 0,
            "width": 0
        },
        "mLaneMarkType": 2,
        "mLaneMarkWidth": 0.3,
        "mLaneMarkXYZW": {
            "w": Math.cos(angle / 2),
            "x": pointX,
            "y": pointY,
            "z": Math.sin(angle / 2)
        },
        "mMapName": "",
        "mPrepointID": null,
        "mTaskListName": "",
        "neighborsID": []
    }
}