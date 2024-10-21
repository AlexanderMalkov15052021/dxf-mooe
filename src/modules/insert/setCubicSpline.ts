import { firstLaneId, firstPointId, firstRoadId, scaleCorrection } from "@/constants";
import { cubicSpline } from "@/helpers/elements/cubicSpline";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { getDistTwoPoints, isNearestPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setCubicSpline = (mooeDoc: MooeDoc, spline: any, permission: number, inaccuracy: number) => {

    const linePointsDiapason = spline?.map((obj: any) => {

        const pointX1 = obj.controlPoints[0].x * scaleCorrection;
        const pointY1 = obj.controlPoints[0].y * scaleCorrection;

        const pointX2 = obj.controlPoints[3].x * scaleCorrection;
        const pointY2 = obj.controlPoints[3].y * scaleCorrection;

        const obj1 = mooeDoc.mLaneMarks.find(
            (point: any) => isNearestPoints(
                obj.controlPoints[0].x * scaleCorrection,
                obj.controlPoints[0].y * scaleCorrection,
                point.mLaneMarkXYZW.x,
                point.mLaneMarkXYZW.y,
                permission
            )
        );

        const newObj1 = roadPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            obj.controlPoints[0].x * scaleCorrection,
            obj.controlPoints[0].y * scaleCorrection,
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

        mooeDoc.mRoads.push(cubicSpline(
            targetObj1?.mLaneMarkID ?? 0,
            targetObj2?.mLaneMarkID ?? 0,
            { x: targetObj1?.mLaneMarkXYZW.x, y: targetObj1?.mLaneMarkXYZW.y },
            { x: targetObj2?.mLaneMarkXYZW.x, y: targetObj2?.mLaneMarkXYZW.y },
            mooeDoc.mRoads.length + firstLaneId,
            Math.PI / 2,
            1,
            mooeDoc.mRoads.length + firstRoadId,
            {
                x: obj.controlPoints[1].x * scaleCorrection * 50,
                y: obj.controlPoints[1].y * scaleCorrection * 50 * -1,
                z: obj.controlPoints[1].z * scaleCorrection * 50
            },
            {
                x: obj.controlPoints[2].x * scaleCorrection * 50,
                y: obj.controlPoints[2].y * scaleCorrection * 50 * -1,
                z: obj.controlPoints[2].z * scaleCorrection * 50
            },
        ));

        const objPos1 = isPermission1 && { x: obj1.mLaneMarkXYZW.x, y: obj1.mLaneMarkXYZW.y };
        const objPos2 = isPermission2 && { x: obj2.mLaneMarkXYZW.x, y: obj2.mLaneMarkXYZW.y };

        return [objPos1, objPos2];

    }).flat().filter((item: any) => item);

    return linePointsDiapason;
}