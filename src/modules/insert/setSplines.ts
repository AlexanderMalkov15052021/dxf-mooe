import { inaccuracy, scaleCorrection } from "@/constants";
import { bezierCurve } from "@/helpers/elements/bezierCurve";
import { isNearestPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setSplines = (mooeDoc: MooeDoc, spline: any, linesLength: number) => {
    spline?.map((obj: any, index: number) => {

        if (obj.controlPoints?.length === 4) {

            const obj1 = mooeDoc.mLaneMarks.find(
                (point: any) => isNearestPoints(
                    obj.controlPoints[0].x * scaleCorrection,
                    obj.controlPoints[0].y * scaleCorrection,
                    point.mLaneMarkXYZW.x,
                    point.mLaneMarkXYZW.y,
                    inaccuracy
                )
            );

            const obj2 = mooeDoc.mLaneMarks.find(
                (point: any) => isNearestPoints(
                    obj.controlPoints[3].x * scaleCorrection,
                    obj.controlPoints[3].y * scaleCorrection,
                    point.mLaneMarkXYZW.x,
                    point.mLaneMarkXYZW.y,
                    inaccuracy
                )
            );

            mooeDoc.mRoads.push(bezierCurve(
                obj1?.mLaneMarkID ?? 0,
                obj2?.mLaneMarkID ?? 0,
                { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y },
                { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y },
                linesLength + index,
                Math.PI / 2,
                1,
                linesLength + index + spline.length,
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
        }

    });
}