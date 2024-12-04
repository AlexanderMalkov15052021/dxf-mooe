import { Coords } from "@/types"

export const quadraticSpline = (
    startId: number, endId: number, startPoint: Coords, endPoint: Coords, id: number, angle: number, roadDir: number,
    roadID: number, controlPoint: any, roadLength: number
) => {
    return {
        "mBelongJunctionID": -1,
        "mEndPosition": {
            "x": endPoint.x,
            "y": endPoint.y,
            "z": Math.sin(angle / 2)
        },
        "mLForbiddenLine": [],
        "mLForbiddenLineID": -1,
        "mLaneCount": 1,
        "mLanes": [
            {
                "mAssistedDrawFlag": false,
                "mAvoidObstacle": false,
                "mBezierControl": {
                    "x": controlPoint.x,
                    "y": controlPoint.y,
                    "z": controlPoint.z
                },
                "mBindMarkAreaID": -1,
                "mBorder": {
                    "roadwidth_left": 0,
                    "roadwidth_right": 0
                },
                "mDataPath": [],
                "mDelta": 0.04,
                "mDirection": roadDir,
                "mEndPos": endId,
                "mGoalAgain": false,
                "mLaneDescript": "",
                "mLaneID": id,
                "mLaneName": "",
                "mLanePro": 0,
                "mLaneType": 1,
                "mLeftAvoidanceArea": 0.1,
                "mLength": roadLength,
                "mMaxCurvature": 0.918637766482173,
                "mObstacleDistance": 0.1,
                "mObstacleWidth": 0.1,
                "mPlannerAgain": false,
                "mPointOfInterest": [],
                "mPosID": 0,
                "mRightAvoidanceArea": 0.1,
                "mSpeed": 0,
                "mStartPos": startId,
                "mWidth": 0.3,
                "usesensor": {
                    "fall_arrest_system": true,
                    "use_bottom_laser": true,
                    "use_front_realsense": true,
                    "use_front_realsense_rgb": true
                }
            }
        ],
        "mLength": roadLength,
        "mRForbiddenLine": [],
        "mRForbiddenLineID": -1,
        "mRoadID": roadID,
        "mRoadName": "",
        "mStartPosition": {
            "x": startPoint.x,
            "y": startPoint.y,
            "z": Math.sin(angle / 2)
        }
    }
}