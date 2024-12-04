import { Coords } from "@/types"

export const cubicSpline = (
    startId: number, endId: number, startPoint: Coords, endPoint: Coords, id: number, angle: number, roadDir: number,
    roadID: number, controlPoint1: any, controloint2: any, roadLength: number
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
                "mLaneType": 2,
                "mLeftAvoidanceArea": 0.1,
                "mLength": roadLength,
                "mMaxCurvature": null,
                "mObstacleDistance": 0.1,
                "mObstacleWidth": 0.1,
                "mPlannerAgain": false,
                "mPointOfInterest": [],
                "mPosID": 0,
                "mRightAvoidanceArea": 0.1,
                "mSpeed": 0,
                "mStartPos": startId,
                "mWidth": 0.3,
                "m_BezierControl1": {
                    "x": controlPoint1.x,
                    "y": controlPoint1.y,
                    "z": controlPoint1.z
                },
                "m_BezierControl2": {
                    "x": controloint2.x,
                    "y": controloint2.y,
                    "z": controloint2.z
                },
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