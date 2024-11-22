export type laneMark = {
    mAvoidPointID?: null;
    mBindRoadGroups?: never[];
    mID?: null;
    mIsJockeyEndpoint: boolean;
    mLaneMarkDescript: string;
    mLaneMarkEnName: string;
    mLaneMarkID: number;
    mLaneMarkName: string;
    mLaneMarkSize?: { height: number; length: number; width: number; } |
    { height: number; length: number; width: number; } |
    { height: number; length: number; width: number; };
    mLaneMarkType: number;
    mLaneMarkWidth: number;
    mLaneMarkXYZW: { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; };
    mMapName?: string;
    mPrepointID?: null;
    mTaskListName?: string;
    neighborsID: never[];
}

export interface MSceneMap {
    mGridMsg: MGridMsg
    mMapAttr: MMapAttr
    version: string
}

export interface MGridMsg {
    data: number
    header: Header
    info: Info
}

export interface Header {
    frame_id: string
    seq: number
    stamp: Stamp
}

export interface Stamp {
    nsecs: number
    secs: number
}

export interface Info {
    height: number
    map_load_time: MapLoadTime
    origin: Origin
    resolution: number
    width: number
}

export interface MapLoadTime {
    nsecs: number
    secs: number
}

export interface Origin {
    orientation: Orientation
    position: Position
}

export interface Orientation {
    w: number
    x: number
    y: number
    z: number
}

export interface Position {
    x: number
    y: number
    z: number
}

export interface MMapAttr {
    mMapArea: number
    mMapCrossNum: number
    mMapFloor: number
    mMapLandMark: number
    mMapLaneNum: number
    mMapLength: number
    mMapName: string
    mMapOrigin: MMapOrigin
    mMapResolution: number
    mMapVerion: string
    mMapWidth: number
}

export interface MMapOrigin {
    x: number
    y: number
    z: number
}


export interface MArea {
    mAreaID: number
    mAreaName: string
    mAreaRect: MAreaRect
    mAreaSpeedLimmiting: number
    mAreaType: number
    mContainsLaneMarks: any[]
    mSensorControl: MSensorControl
}

export interface MAreaRect {
    bottomLeftPoint: BottomLeftPoint
    bottomRightPoint: BottomRightPoint
    height: number
    orientation: Orientation
    topLeftPoint: TopLeftPoint
    topRightPoint: TopRightPoint
    width: number
}

export interface BottomLeftPoint {
    x: number
    y: number
    z: number
}

export interface BottomRightPoint {
    x: number
    y: number
    z: number
}

export interface Orientation {
    w: number
    x: number
    y: number
    z: number
}

export interface TopLeftPoint {
    x: number
    y: number
    z: number
}

export interface TopRightPoint {
    x: number
    y: number
    z: number
}

export interface MSensorControl {
    mOpenBottomLaser: boolean
    mOpenFallPrevention: boolean
    mOpenFrontCameraRGB: boolean
    mOpenFrontCamrea: boolean
}

export interface MCrossRule {
    area_num: any[]
    area_num_partial: any[]
    back_up: any[]
    cross_stop: CrossStop
    road_robot_num: any[]
    robot_num: RobotNum[]
}

export interface CrossStop { }

export interface RobotNum {
    num: number
    road_id: number
    roads: number[]
}

export type MooeDoc = {
    // mAreas: MArea[];
    mLaneMarks: laneMark[];
    mRoads: {
        mBelongJunctionID: number;
        mEndPosition: { x: any; y: any; z: number; } |
        { x: number; y: number; z: number; };
        mLForbiddenLine: never[];
        mLForbiddenLineID: number;
        mLaneCount: number;
        mLanes: {
            mAssistedDrawFlag: boolean;
            mAvoidObstacle: boolean;
            mBezierControl?: {
                x: number;
                y: number;
                z: number;
            },
            mBindMarkAreaID: number;
            mBorder: {
                roadwidth_left: number;
                roadwidth_right: number;
            };
            mDelta: number;
            mDirection: number;
            mEndPos: number;
            mGoalAgain: boolean;
            mLaneDescript: string;
            mLaneID: number;
            mLaneName: string;
            mLanePro: number;
            mLaneType: number;
            mLeftAvoidanceArea: number;
            mLength: number | null;
            mMaxCurvature?: number | null;
            mObstacleDistance: number;
            mObstacleWidth: number;
            mPlannerAgain: boolean;
            mPointOfInterest: never[];
            mPosID: number;
            mRightAvoidanceArea: number;
            mSpeed: number;
            mStartPos: number;
            mWidth: number;
            usesensor: {
                fall_arrest_system: boolean;
                use_bottom_laser: boolean;
                use_front_realsense: boolean;
                use_front_realsense_rgb: boolean;
            };
        }[] |
        {
            mAssistedDrawFlag: boolean;
            mAvoidObstacle: boolean;
            mBindMarkAreaID: number;
            mBorder: { roadwidth_left: number; roadwidth_right: number; };
            mDelta: number;
            mDirection: number;
            mEndPos: number;
            mGoalAgain: boolean;
            mLaneDescript: string;
            mLaneID: number;
            mLaneName: string;
            mLanePro: number;
            mLaneType: number;
            mLeftAvoidanceArea: number;
            mLength: number | null;
            mObstacleDistance: number;
            mObstacleWidth: number;
            mPlannerAgain: boolean;
            mPointOfInterest: never[];
            mPosID: number;
            mRightAvoidanceArea: number;
            mSpeed: number;
            mStartPos: number;
            mWidth: number;
            usesensor: {
                fall_arrest_system: boolean;
                use_bottom_laser: boolean;
                use_front_realsense: boolean;
                use_front_realsense_rgb: boolean;
            };
        }[];
        mLength: number | null;
        mRForbiddenLine: never[];
        mRForbiddenLineID: number;
        mRoadID: number;
        mRoadName: string;
        mStartPosition: { x: any; y: any; z: number; }
        | { x: any; y: any; z: number; };
    }[];
    mSceneMap: MSceneMap;
    mapRotateAngle: number;
};

export type Coords = {
    x: number; y: number; z: number;
};

export type Coords2D = {
    x: number; y: number;
};

export interface BezierCurve {
    mBelongJunctionID: number
    mEndPosition: MEndPosition
    mLForbiddenLine: any[]
    mLForbiddenLineID: number
    mLaneCount: number
    mLanes: MLane[]
    mLength: number
    mRForbiddenLine: any[]
    mRForbiddenLineID: number
    mRoadID: number
    mRoadName: string
    mStartPosition: MStartPosition
}

export interface MEndPosition {
    x: number
    y: number
    z: number
}

export interface MLane {
    mAssistedDrawFlag: boolean
    mAvoidObstacle: boolean
    mBindMarkAreaID: number
    mBorder: MBorder
    mDataPath: any[]
    mDelta: number
    mDirection: number
    mEndPos: number
    mGoalAgain: boolean
    mLaneDescript: string
    mLaneID: number
    mLaneName: string
    mLanePro: number
    mLaneType: number
    mLeftAvoidanceArea: number
    mLength: number
    mMaxCurvature: number
    mObstacleDistance: number
    mObstacleWidth: number
    mPlannerAgain: boolean
    mPointOfInterest: any[]
    mPosID: number
    mRightAvoidanceArea: number
    mSpeed: number
    mStartPos: number
    mWidth: number
    m_BezierControl1: MBezierControl1
    m_BezierControl2: MBezierControl2
    usesensor: Usesensor
}

export interface MBorder {
    roadwidth_left: number
    roadwidth_right: number
}

export interface MBezierControl1 {
    x: number
    y: number
    z: number
}

export interface MBezierControl2 {
    x: number
    y: number
    z: number
}

export interface Usesensor {
    fall_arrest_system: boolean
    use_bottom_laser: boolean
    use_front_realsense: boolean
    use_front_realsense_rgb: boolean
}

export interface MStartPosition {
    x: number
    y: number
    z: number
}

export type FieldType = {
    rotAngle: string;
    autocadPointX: string;
    autocadPointY: string;
    moeePointX: string;
    moeePointY: string;
    inaccuracy: string;
    permission: string;
};

export type dxfIdsBuff = {
    roadIds: number[];
    laneIds: number[];
    pointIds: number[];
};

export type DxfIdsData = {
    dxfIdsList: Record<string, string[]>;
    dxfIdsBuff: dxfIdsBuff;
};
