import { firstPointId, scaleCorrection } from "@/constants";
import { cubicSpline } from "@/helpers/elements/cubicSpline";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { getDistTwoPoints, isNearestPoints } from "@/helpers/math";
import { Coords, MooeDoc } from "@/types";

export const setCubicSpline = (
    mooeDoc: MooeDoc, dxfIdsList: Record<string, string[]>, spline: any, permission: number, inaccuracy: number, origin: Coords
) => {

    const linePointsDiapason = spline?.map((obj: any) => {

        const pointX1 = (obj.controlPoints[0].x + origin.x) * scaleCorrection;
        const pointY1 = (obj.controlPoints[0].y + origin.y) * scaleCorrection;

        const pointX2 = (obj.controlPoints[3].x + origin.x) * scaleCorrection;
        const pointY2 = (obj.controlPoints[3].y + origin.y) * scaleCorrection;

        const obj1 = mooeDoc.mLaneMarks.find(
            (point: any) => isNearestPoints(
                pointX1,
                pointY1,
                point.mLaneMarkXYZW.x,
                point.mLaneMarkXYZW.y,
                permission
            )
        );

        const newObj1 = roadPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX1,
            pointY1,
            Math.PI / 2
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

        const newObj2 = roadPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX2,
            pointY2,
            Math.PI / 2
        );

        const targetObj1 = !obj1 ? newObj1 : obj1;
        const targetObj2 = !obj2 ? newObj2 : obj2;

        targetObj1 === newObj1 && mooeDoc.mLaneMarks.push(newObj1);
        targetObj2 === newObj2 && mooeDoc.mLaneMarks.push(newObj2);

        const isPermission1 = obj1 && getDistTwoPoints(obj1.mLaneMarkXYZW.x, obj1.mLaneMarkXYZW.y, pointX1, pointY1) > inaccuracy;
        const isPermission2 = obj2 && getDistTwoPoints(obj2.mLaneMarkXYZW.x, obj2.mLaneMarkXYZW.y, pointX2, pointY2) > inaccuracy;

        const ids = dxfIdsList[obj.handle];

        mooeDoc.mRoads.push(cubicSpline(
            targetObj1?.mLaneMarkID ?? 0,
            targetObj2?.mLaneMarkID ?? 0,
            { x: targetObj1?.mLaneMarkXYZW.x, y: targetObj1?.mLaneMarkXYZW.y, z: targetObj1?.mLaneMarkXYZW.z },
            { x: targetObj2?.mLaneMarkXYZW.x, y: targetObj2?.mLaneMarkXYZW.y, z: targetObj2?.mLaneMarkXYZW.z },
            ids ? Number(ids[1]) : 0,
            Math.PI / 2,
            1,
            ids ? Number(ids[0]) : 0,
            {
                x: (obj.controlPoints[1].x + origin.x) * scaleCorrection * 50,
                y: (obj.controlPoints[1].y + origin.y) * scaleCorrection * 50 * -1,
                z: (obj.controlPoints[1].z + origin.z) * scaleCorrection * 50
            },
            {
                x: (obj.controlPoints[2].x + origin.x) * scaleCorrection * 50,
                y: (obj.controlPoints[2].y + origin.y) * scaleCorrection * 50 * -1,
                z: (obj.controlPoints[2].z + origin.z) * scaleCorrection * 50
            },
        ));

        const objPos1 = isPermission1 && { x: obj1.mLaneMarkXYZW.x, y: obj1.mLaneMarkXYZW.y, z: obj1.mLaneMarkXYZW.z };
        const objPos2 = isPermission2 && { x: obj2.mLaneMarkXYZW.x, y: obj2.mLaneMarkXYZW.y, z: obj2.mLaneMarkXYZW.z };

        return [objPos1, objPos2];

    }).flat().filter((item: any) => item);

    return linePointsDiapason;
}