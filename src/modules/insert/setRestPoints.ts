import { distToTargrtPoint, maxDist, scaleCorrection } from "@/constants";
import { prePoint } from "@/helpers/elements/prePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setRestPoints = (mooeDoc: MooeDoc, rests: any, restLines: any, linesLength: number, palletesLength: number) => {
    rests?.map((obj: any, index: number) => {

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

        mooeDoc.mLaneMarks.push(windingPoint(
            linesLength + index,
            pointX,
            pointY,
            angle,
            obj.text.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            linesLength + index + palletesLength * 2,
            pointX + (distToTargrtPoint * Math.cos(angle)),
            pointY + (distToTargrtPoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}Target1`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            linesLength + index + palletesLength * 3,
            lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(Math.PI * 2 + angle + Math.PI / 2)),
            lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(Math.PI * 2 + angle + Math.PI / 2)),
            Math.PI * 2 + angle + Math.PI / 2,
            `${obj.text.replace(" ", "")}Target2`
        ));

        if (obj.text.includes("01")) {
            mooeDoc.mLaneMarks.push(prePoint(
                linesLength + index + palletesLength * 4,
                lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * 2 * Math.cos(Math.PI * 2 + angle - Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * 2 * Math.sin(Math.PI * 2 + angle - Math.PI / 2)),
                Math.PI * 2 + angle + Math.PI / 2,
                `${obj.text}entrance`
            ));
        }

    });
}