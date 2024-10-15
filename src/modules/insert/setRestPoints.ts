import { distToTargrtPoint, firstPointId, maxDist, scaleCorrection } from "@/constants";
import { prePoint } from "@/helpers/elements/prePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setRestPoints = (mooeDoc: MooeDoc, rests: any, restLines: any, lines: any) => {
    rests?.map((obj: any) => {

        const pointX = obj.position.x * scaleCorrection;
        const pointY = obj.position.y * scaleCorrection;

        const lineData = restLines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                pointX,
                pointY,
                line.vertices[0].x * scaleCorrection,
                line.vertices[0].y * scaleCorrection,
                line.vertices[1].x * scaleCorrection,
                line.vertices[1].y * scaleCorrection
            );

            if (dist < accum.dist) {
                accum.dist = dist;
                accum.line = line;
            }

            return accum;

        }, { dist: maxDist, line: null });

        const angle = getAtan2(
            lineData.line.vertices[0].x,
            lineData.line.vertices[0].y,
            lineData.line.vertices[1].x,
            lineData.line.vertices[1].y
        );

        const targetLineData = lines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                lineData.line.vertices[1].x * scaleCorrection - (distToTargrtPoint * Math.cos(angle + Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection - (distToTargrtPoint * Math.sin(angle + Math.PI / 2)),
                line.vertices[0].x * scaleCorrection,
                line.vertices[0].y * scaleCorrection,
                line.vertices[1].x * scaleCorrection,
                line.vertices[1].y * scaleCorrection
            );

            if (dist < accum.dist) {
                accum.dist = dist;
                accum.line = line;
            }

            return accum;

        }, { dist: maxDist, line: null });

        const targetAngle = getAtan2(
            targetLineData.line.vertices[0].x,
            targetLineData.line.vertices[0].y,
            targetLineData.line.vertices[1].x,
            targetLineData.line.vertices[1].y
        );

        mooeDoc.mLaneMarks.push(windingPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX,
            pointY,
            angle,
            obj.text.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX + (distToTargrtPoint * Math.cos(angle)),
            pointY + (distToTargrtPoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}检`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            lineData.line.vertices[1].x * scaleCorrection - (distToTargrtPoint * Math.cos(angle + Math.PI / 2)),
            lineData.line.vertices[1].y * scaleCorrection - (distToTargrtPoint * Math.sin(angle + Math.PI / 2)),
            targetAngle,
            `${obj.text.replace(" ", "")}前置点`
        ));

        if (obj.text.includes("01")) {
            mooeDoc.mLaneMarks.push(prePoint(
                mooeDoc.mLaneMarks.length + firstPointId,
                lineData.line.vertices[1].x * scaleCorrection - (distToTargrtPoint * 2 * Math.cos(angle - Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection - (distToTargrtPoint * 2 * Math.sin(angle - Math.PI / 2)),
                angle - Math.PI / 2,
                `${obj.text.split("col")[0]}entrance`
            ));
        }

    });
}