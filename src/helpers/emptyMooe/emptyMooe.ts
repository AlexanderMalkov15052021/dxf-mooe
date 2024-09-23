import { MooeDoc } from "@/types";

export const emptyMooe: MooeDoc = {
    // mAreas: [
    //     {
    //         mAreaID: 363564,
    //         mAreaName: "",
    //         mAreaRect: {
    //             bottomLeftPoint: {
    //                 x: 0,
    //                 y: 0,
    //                 z: 0
    //             },
    //             bottomRightPoint: {
    //                 x: 10,
    //                 y: 0,
    //                 z: 0
    //             },
    //             height: 100,
    //             orientation: {
    //                 w: 1,
    //                 x: 0,
    //                 y: 0,
    //                 z: 0
    //             },
    //             topLeftPoint: {
    //                 x: 0,
    //                 y: 10,
    //                 z: 0
    //             },
    //             topRightPoint: {
    //                 x: 10,
    //                 y: 10,
    //                 z: 0
    //             },
    //             width: 100
    //         },
    //         mAreaSpeedLimmiting: 0.4,
    //         mAreaType: 7,
    //         mContainsLaneMarks: [],
    //         mSensorControl: {
    //             mOpenBottomLaser: true,
    //             mOpenFallPrevention: true,
    //             mOpenFrontCameraRGB: true,
    //             mOpenFrontCamrea: true
    //         }
    //     }
    // ],


    mLaneMarks: [],
    mRoads: [],

    
    mSceneMap: {
        mGridMsg: {
            data: 0.04,
            header: {
                frame_id: "/map",
                seq: 0,
                stamp: {
                    nsecs: 0,
                    secs: 0
                }
            },
            info: {
                height: 5000,
                map_load_time: {
                    nsecs: 0,
                    secs: 0
                },
                origin: {
                    orientation: {
                        w: 1,
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    position: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                resolution: 0.050,
                width: 8000
            }
        },
        mMapAttr: {
            mMapArea: 1000,
            mMapCrossNum: 0,
            mMapFloor: 0,
            mMapLandMark: 1000000,
            mMapLaneNum: 100000,
            mMapLength: 100,
            mMapName: "example",
            mMapOrigin: {
                x: 0,
                y: 0,
                z: 0
            },
            mMapResolution: 0.050,
            mMapVerion: "1.0.0",
            mMapWidth: 100
        },
        version: "1.0.0"
    },
    mapRotateAngle: 0.7
}