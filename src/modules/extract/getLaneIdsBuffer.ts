import { MooeDoc } from "@/types";

export const getLaneIdsBuffer = (mooeDoc: MooeDoc) => {

    const bufferIds = Array.from({ length: 100000 }, (_, index) => index + 700000);

    const mLaneMarkIds = mooeDoc?.mLaneMarks.map((obj: { mLaneMarkID: number }) => obj.mLaneMarkID);
    const mRoadIds = mooeDoc?.mRoads.map((obj: { mRoadID: number }) => obj.mRoadID);
    const mLaneIds = mooeDoc?.mRoads.map((obj: { mRoadID: number, mLanes: { mLaneID: number }[] }) => obj.mLanes[0].mLaneID);

    const laneIdsBuffer = bufferIds.filter((id: number) => !mLaneIds?.includes(id))
        .filter((id: number) => !mLaneMarkIds?.includes(id))
        .filter((id: number) => !mRoadIds?.includes(id));

    return laneIdsBuffer;
}