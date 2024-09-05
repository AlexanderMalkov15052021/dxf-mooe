export type MooeDoc = {
    mLaneMarks: {
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
    }[];
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
            mLength: number;
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
            mLength: number;
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
        mLength: number;
        mRForbiddenLine: never[];
        mRForbiddenLineID: number;
        mRoadID: number;
        mRoadName: string;
        mStartPosition: { x: any; y: any; z: number; }
        | { x: any; y: any; z: number; };
    }[];
} | null;

export type FieldType = {
    x1: number;
    y1: number;
    angle: number;
    x2: number;
    y2: number;
    numRow: number;
    columnsInterval: number;
};

export type Coords = {
    id: number; x: number; y: number 
};