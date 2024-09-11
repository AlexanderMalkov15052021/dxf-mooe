export const windingPoint = (
    lastId: number, pointX: number, pointY: number, angle: number, zoneName: string
) => {
    return {
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": `${zoneName}`,
        "mLaneMarkID": lastId,
        "mLaneMarkName": `${zoneName}`,
        "mLaneMarkType": 11,
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