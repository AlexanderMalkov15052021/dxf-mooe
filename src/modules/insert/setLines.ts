import { inaccuracy, scaleCorrection } from "@/constants";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { isNearestPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setLines = (mooeDoc: MooeDoc, lines: any) => {

    lines?.map((obj: any, index: number) => {
        const pointX1 = obj.vertices[0].x * scaleCorrection
        const pointY1 = obj.vertices[0].y * scaleCorrection

        const pointX2 = obj.vertices[1].x * scaleCorrection
        const pointY2 = obj.vertices[1].y * scaleCorrection

        const startId = 1 + (index * 4);
        const endId = 2 + (index * 4);
        const laneId = 3 + (index * 4);
        const roadId = 4 + (index * 4);

        const obj1 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX1, pointY1, inaccuracy)
        );
        const obj2 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX2, pointY2, inaccuracy)
        );

        !obj1 && mooeDoc.mLaneMarks.push(roadPoint(startId, pointX1, pointY1, Math.PI / 2));
        !obj2 && mooeDoc.mLaneMarks.push(roadPoint(endId, pointX2, pointY2, Math.PI / 2));

        mooeDoc.mRoads.push(road(
            !obj1 ? startId : obj1.mLaneMarkID,
            !obj2 ? endId : obj2.mLaneMarkID,
            !obj1 ? { x: pointX1, y: pointY1 } : { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y },
            !obj2 ? { x: pointX2, y: pointY2 } : { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y },
            laneId,
            Math.PI / 2,
            1,
            roadId
        ));
    });
}