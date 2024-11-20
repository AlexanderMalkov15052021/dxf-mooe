import { MooeDoc } from "@/types";
import { getRoadIdsBuffer } from "../extract/getRoadIdsBuffer";
import { getLaneIdsBuffer } from "../extract/getLaneIdsBuffer";
import { getPointIdsBuffer } from "../extract/getPointIdsBuffer";

export const setNewIds = (mooeDoc: MooeDoc) => {

    const roadIdsBuffer = getRoadIdsBuffer(mooeDoc);
    const laneIdsBuffer = getLaneIdsBuffer(mooeDoc);
    const pointIdsBuffer = getPointIdsBuffer(mooeDoc);

    mooeDoc.mRoads.map((obj, index: number) => {
        obj.mRoadID === 0 && (obj.mRoadID = roadIdsBuffer[index]);
        obj.mLanes[0].mLaneID === 0 && (obj.mLanes[0].mLaneID = laneIdsBuffer[index]);
    });

    mooeDoc.mLaneMarks.map((obj, index: number) => obj.mLaneMarkID === 0 && (obj.mLaneMarkID = pointIdsBuffer[index]));
    
}