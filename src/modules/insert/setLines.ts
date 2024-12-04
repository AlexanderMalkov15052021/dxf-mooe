import { scaleCorrection } from "@/constants";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { getDistTwoPoints, isNearestPoints } from "@/helpers/math";
import { Coords, dxfIdsBuff, laneMark, MooeDoc } from "@/types";

const getTargetId = (mooeDoc: MooeDoc, buff: dxfIdsBuff, x: number, y: number, newPoints: number[], obj?: laneMark) => {

    if (!obj) {
        mooeDoc.mLaneMarks.push(roadPoint(buff.pointIds[newPoints.length], x, y, Math.PI / 2));
        newPoints.push(buff.pointIds[newPoints.length]);
        return buff.pointIds[newPoints.length - 1];
    }
    else {
        return obj.mLaneMarkID;
    }

}

export const setLines = (mooeDoc: MooeDoc, dxfIdsList: Record<string, string[]>, dxfIdsBuff: dxfIdsBuff, lines: any,
    permission: number, inaccuracy: number, origin: Coords) => {

    const newRoads: number[] = [];
    const newLanes: number[] = [];
    const newPoints: number[] = [];

    const linePointsDiapason = lines?.map((obj: any) => {

        const isPickUpLane = obj.layer.includes("Pallet roads") || obj.layer.includes("Charge roads")
            || obj.layer.includes("Rest roads") || obj.layer.includes("Flow roads");

        const pointX1 = (obj.vertices[0].x + origin.x) * scaleCorrection;
        const pointY1 = (obj.vertices[0].y + origin.y) * scaleCorrection;
        const pointZ1 = (obj.vertices[0].z + origin.z) * scaleCorrection;

        const pointX2 = (obj.vertices[1].x + origin.x) * scaleCorrection;
        const pointY2 = (obj.vertices[1].y + origin.y) * scaleCorrection;
        const pointZ2 = (obj.vertices[1].z + origin.z) * scaleCorrection;

        const ids = dxfIdsList[obj.handle];

        if (ids?.length) {

            const id0 = Number(ids[0]);
            const id1 = Number(ids[1]);
            const id2 = Number(ids[2]);
            const id3 = Number(ids[3]);

            const obj1 = mooeDoc.mLaneMarks.find((obj: laneMark) => obj.mLaneMarkID === id2);
            const obj2 = mooeDoc.mLaneMarks.find((obj: laneMark) => obj.mLaneMarkID === id3);

            !obj1 && mooeDoc.mLaneMarks.push(roadPoint(id2, pointX1, pointY1, Math.PI / 2));

            !obj2 && mooeDoc.mLaneMarks.push(roadPoint(id3, pointX2, pointY2, Math.PI / 2));


            const startPoint = obj1
                ? { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y, z: obj1?.mLaneMarkXYZW.z }
                : { x: pointX1, y: pointY1, z: pointZ1 };

            const endPoint = obj2
                ? { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y, z: obj2?.mLaneMarkXYZW.z }
                : { x: pointX2, y: pointY2, z: pointZ2 };


            const roadLength = getDistTwoPoints(startPoint.x, startPoint.y, endPoint.x, endPoint.y);


            mooeDoc.mRoads.push(road(
                id0,
                id1,
                obj1 ? obj1.mLaneMarkID : id2,
                obj2 ? obj2.mLaneMarkID : id3,
                startPoint,
                endPoint,
                Math.PI / 2,
                obj.layer === "Bidirectional roads" ? 0 : 1,
                isPickUpLane ? 1 : 0,
                roadLength
            ));

            const isPermission1 = obj1 && getDistTwoPoints(obj1.mLaneMarkXYZW.x, obj1.mLaneMarkXYZW.y, pointX1, pointY1) > inaccuracy;
            const isPermission2 = obj2 && getDistTwoPoints(obj2.mLaneMarkXYZW.x, obj2.mLaneMarkXYZW.y, pointX2, pointY2) > inaccuracy;

            const objPos1 = isPermission1 && { x: obj1.mLaneMarkXYZW.x, y: obj1.mLaneMarkXYZW.y, z: obj1.mLaneMarkXYZW.z };
            const objPos2 = isPermission2 && { x: obj2.mLaneMarkXYZW.x, y: obj2.mLaneMarkXYZW.y, z: obj2.mLaneMarkXYZW.z };

            return [objPos1, objPos2];
        }
        else {

            const obj1 = mooeDoc.mLaneMarks.find(
                (point: any) => isNearestPoints(
                    pointX1,
                    pointY1,
                    point.mLaneMarkXYZW.x,
                    point.mLaneMarkXYZW.y,
                    permission
                )
            );

            const obj2 = mooeDoc.mLaneMarks.find(
                (point: any) => isNearestPoints(
                    pointX2,
                    pointY2,
                    point.mLaneMarkXYZW.x,
                    point.mLaneMarkXYZW.y,
                    permission
                )
            );

            const startId = getTargetId(mooeDoc, dxfIdsBuff, pointX1, pointY1, newPoints, obj1);
            const endId = getTargetId(mooeDoc, dxfIdsBuff, pointX2, pointY2, newPoints, obj2);


            const startPoint = obj1
                ? { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y, z: obj1?.mLaneMarkXYZW.z }
                : { x: pointX1, y: pointY1, z: pointZ1 };

            const endPoint = obj2
                ? { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y, z: obj2?.mLaneMarkXYZW.z }
                : { x: pointX2, y: pointY2, z: pointZ2 };


            const roadLength = getDistTwoPoints(startPoint.x, startPoint.y, endPoint.x, endPoint.y);


            mooeDoc.mRoads.push(road(
                dxfIdsBuff.roadIds[newRoads.length],
                dxfIdsBuff.laneIds[newLanes.length],
                startId,
                endId,
                startPoint,
                endPoint,
                Math.PI / 2,
                obj.layer === "Bidirectional roads" ? 0 : 1,
                isPickUpLane ? 1 : 0,
                roadLength
            ));

            newRoads.push(dxfIdsBuff.roadIds[newRoads.length]);
            newLanes.push(dxfIdsBuff.laneIds[newLanes.length]);

            const isPermission1 = obj1 && getDistTwoPoints(obj1.mLaneMarkXYZW.x, obj1.mLaneMarkXYZW.y, pointX1, pointY1) > inaccuracy;
            const isPermission2 = obj2 && getDistTwoPoints(obj2.mLaneMarkXYZW.x, obj2.mLaneMarkXYZW.y, pointX2, pointY2) > inaccuracy;

            const objPos1 = isPermission1 && { x: obj1.mLaneMarkXYZW.x, y: obj1.mLaneMarkXYZW.y, z: obj1.mLaneMarkXYZW.z };
            const objPos2 = isPermission2 && { x: obj2.mLaneMarkXYZW.x, y: obj2.mLaneMarkXYZW.y, z: obj2.mLaneMarkXYZW.z };

            return [objPos1, objPos2];
        }

    }).flat().filter((item: any) => item);

    dxfIdsBuff.roadIds = dxfIdsBuff.roadIds.filter(id => !newRoads.includes(id));
    dxfIdsBuff.laneIds = dxfIdsBuff.laneIds.filter(id => !newLanes.includes(id));
    dxfIdsBuff.pointIds = dxfIdsBuff.pointIds.filter(id => !newPoints.includes(id));

    return linePointsDiapason;
}