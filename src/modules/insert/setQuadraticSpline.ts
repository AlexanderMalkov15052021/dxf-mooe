import { firstLaneId, firstPointId, firstRoadId, inaccuracy, scaleCorrection } from "@/constants";
import { quadraticSpline } from "@/helpers/elements/quadraticSpline";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { isNearestPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setQuadraticSpline = (mooeDoc: MooeDoc, spline: any) => {
    spline?.map((obj: any) => {

        const obj1 = mooeDoc.mLaneMarks.find(
            (point: any) => isNearestPoints(
                obj.controlPoints[0].x * scaleCorrection,
                obj.controlPoints[0].y * scaleCorrection,
                point.mLaneMarkXYZW.x,
                point.mLaneMarkXYZW.y,
                inaccuracy
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
                obj.controlPoints[2].x * scaleCorrection,
                obj.controlPoints[2].y * scaleCorrection,
                point.mLaneMarkXYZW.x,
                point.mLaneMarkXYZW.y,
                inaccuracy
            )
        );

        const newObj2 = roadPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            obj.controlPoints[2].x * scaleCorrection,
            obj.controlPoints[2].y * scaleCorrection,
            Math.PI / 2
        );

        const targetObj1 = !obj1 ? newObj1 : obj1;
        const targetObj2 = !obj2 ? newObj2 : obj2;

        targetObj1 === newObj1 && mooeDoc.mLaneMarks.push(newObj1);
        targetObj2 === newObj2 && mooeDoc.mLaneMarks.push(newObj2);

        mooeDoc.mRoads.push(quadraticSpline(
            targetObj1?.mLaneMarkID ?? 0,
            targetObj2?.mLaneMarkID ?? 0,
            { x: targetObj1?.mLaneMarkXYZW.x, y: targetObj1?.mLaneMarkXYZW.y },
            { x: targetObj2?.mLaneMarkXYZW.x, y: targetObj2?.mLaneMarkXYZW.y },
            mooeDoc.mRoads.length + firstLaneId,
            Math.PI / 2,
            1,
            mooeDoc.mRoads.length + firstRoadId,
            {
                x: obj.controlPoints[1].x * scaleCorrection,
                y: obj.controlPoints[1].y * scaleCorrection,
                z: obj.controlPoints[1].z * scaleCorrection
            }
        ));

    });
}