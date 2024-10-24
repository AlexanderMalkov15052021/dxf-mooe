import { scaleCorrection, firstPointId, firstLaneId, firstRoadId } from "@/constants";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { getDistTwoPoints, isNearestPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setLines = (mooeDoc: MooeDoc, lines: any, permission: number, inaccuracy: number) => {

    const linePointsDiapason = lines?.map((obj: any) => {
        const pointX1 = obj.vertices[0].x * scaleCorrection;
        const pointY1 = obj.vertices[0].y * scaleCorrection;

        const pointX2 = obj.vertices[1].x * scaleCorrection;
        const pointY2 = obj.vertices[1].y * scaleCorrection;

        const obj1 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX1, pointY1, permission)
        );

        const obj2 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX2, pointY2, permission)
        );

        const obj1Id = !obj1
            ? mooeDoc.mLaneMarks.push(
                roadPoint(mooeDoc.mLaneMarks.length + firstPointId, pointX1, pointY1, Math.PI / 2)
            ) - 1 + firstPointId
            : obj1.mLaneMarkID;

        const obj2Id = !obj2
            ? mooeDoc.mLaneMarks.push(
                roadPoint(mooeDoc.mLaneMarks.length + firstPointId, pointX2, pointY2, Math.PI / 2)
            ) - 1 + firstPointId
            : obj2.mLaneMarkID;

        const isPermission1 = obj1 && getDistTwoPoints(obj1.mLaneMarkXYZW.x, obj1.mLaneMarkXYZW.y, pointX1, pointY1) > inaccuracy;
        const isPermission2 = obj2 && getDistTwoPoints(obj2.mLaneMarkXYZW.x, obj2.mLaneMarkXYZW.y, pointX2, pointY2) > inaccuracy;

        mooeDoc.mRoads.push(road(
            obj1Id,
            obj2Id,
            !obj1 ? { x: pointX1, y: pointY1 } : { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y },
            !obj2 ? { x: pointX2, y: pointY2 } : { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y },
            mooeDoc.mRoads.length + firstLaneId,
            Math.PI / 2,
            obj.layer === "Bidirectional roads" ? 0 : 1,
            mooeDoc.mRoads.length + firstRoadId
        ));

        const objPos1 = isPermission1 && { x: obj1.mLaneMarkXYZW.x, y: obj1.mLaneMarkXYZW.y };
        const objPos2 = isPermission2 && { x: obj2.mLaneMarkXYZW.x, y: obj2.mLaneMarkXYZW.y };

        return [objPos1, objPos2];

    }).flat().filter((item: any) => item);

    return linePointsDiapason;
}