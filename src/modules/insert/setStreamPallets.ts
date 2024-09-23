import { distToCachePoint, distToTargrtPoint, firstPointId, maxDist, scaleCorrection } from "@/constants";
import { cachePoint } from "@/helpers/elements/cachePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setStreamPallets = (mooeDoc: MooeDoc, pallete: any, palletLines: any) => {
    pallete?.map((obj: any) => {

        const pointX = obj.position.x * scaleCorrection;
        const pointY = obj.position.y * scaleCorrection;

        const lineData = palletLines.reduce((accum: { dist: number, line: any }, line: any) => {

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
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX,
            pointY,
            angle,
            obj.text.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(cachePoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX + (distToCachePoint * Math.cos(angle)),
            pointY + (distToCachePoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}识别`
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
            lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(Math.PI * 2 + angle + Math.PI / 2)),
            lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(Math.PI * 2 + angle + Math.PI / 2)),
            Math.PI * 2 + angle + Math.PI / 2,
            `${obj.text.replace(" ", "")}前置点`
        ));

    });
}