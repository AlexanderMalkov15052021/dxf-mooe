import { scaleCorrection } from "@/constants";
import { curveRoad } from "@/helpers/elements/curveRoad";
import { getAtan2, getDistancePoints, getDistTwoPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setArc = (mooeDoc: MooeDoc, arc: any, linesLength: number, palleteLength: number) => {
    arc?.map((obj: any, index: number) => {

        const centerX = obj.center.x * scaleCorrection;
        const centerY = obj.center.y * scaleCorrection;

        const pointsData = mooeDoc.mLaneMarks.map((point: any) => {

            const pX = point.mLaneMarkXYZW.x;
            const pY = point.mLaneMarkXYZW.y;

            const dist = getDistancePoints(centerX, centerY, pX, pY);

            return {
                dist,
                point
            }
        }).sort((a, b) => a.dist - b.dist).slice(0, 2);

        const middleX = (pointsData[0].point.mLaneMarkXYZW.x + pointsData[1].point.mLaneMarkXYZW.x) / 2;
        const middleY = (pointsData[0].point.mLaneMarkXYZW.y + pointsData[1].point.mLaneMarkXYZW.y) / 2;

        const radius = getDistTwoPoints(middleX, middleY, centerX, centerY);

        const angle = getAtan2(
            centerX,
            centerY,
            middleX,
            middleY
        );

        const targetX = middleX + (radius * Math.cos(angle));
        const targetY = middleY + (radius * Math.sin(angle));


        const road = mooeDoc.mRoads.find(
            (road: any) =>
                road.mLanes[0].mEndPos === pointsData[0].point.mLaneMarkID || road.mLanes[0].mStartPos === pointsData[0].point.mLaneMarkID
        );

        const opositDir = road?.mLanes[0].mDirection === 1 ? 2 : 1;

        const isStartPos = road?.mLanes[0].mStartPos === pointsData[0].point.mLaneMarkID;

        const dir = isStartPos ? opositDir : (road?.mLanes[0].mDirection ?? 0);

        mooeDoc.mRoads.push(curveRoad(
            pointsData[0].point.mLaneMarkID,
            pointsData[1].point.mLaneMarkID,
            { x: pointsData[0].point.mLaneMarkXYZW.x, y: pointsData[0].point.mLaneMarkXYZW.y },
            { x: pointsData[1].point.mLaneMarkXYZW.x, y: pointsData[1].point.mLaneMarkXYZW.y },
            linesLength + index + palleteLength,
            Math.PI / 2,
            dir,
            { x: targetX, y: targetY },
            linesLength + index + palleteLength + arc.length
        ));

    });
}