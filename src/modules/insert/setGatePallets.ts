import { distToGateCachePoint, distToGatePrePoint, distToTargrtPoint, maxDist, scaleCorrection } from "@/constants";
import { cachePoint } from "@/helpers/elements/cachePoint";
import { pallet } from "@/helpers/elements/pallet";
import { prePoint } from "@/helpers/elements/prePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { getAtan2, getDistPointToline } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setGatePallets = (mooeDoc: MooeDoc, pallete: any, palletLines: any, linesLength: number, palletesLength: number) => {
    pallete?.map((obj: any, index: number) => {

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

        mooeDoc.mLaneMarks.push(pallet(
            linesLength + index,
            pointX,
            pointY,
            angle,
            obj.text.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(cachePoint(
            linesLength + index + palletesLength,
            pointX + (distToGateCachePoint * Math.cos(angle)),
            pointY + (distToGateCachePoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}Cache`
        ));

        if (obj.text.includes("row 1")) {
            mooeDoc.mLaneMarks.push(targetPoint(
                linesLength + index + palletesLength * 2,
                lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(Math.PI * 2 + angle + Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(Math.PI * 2 + angle + Math.PI / 2)),
                Math.PI * 2 + angle + Math.PI / 2,
                `${obj.text.replace(" ", "")}Target2`
            ));
        }

        if (obj.text.includes("row 1") && index < pallete.length / 2 && index > pallete.length / 2.5) {
            mooeDoc.mLaneMarks.push(prePoint(
                linesLength + index + palletesLength * 3,
                lineData.line.vertices[1].x * scaleCorrection + (distToGatePrePoint * 2 * Math.cos(Math.PI * 2 + angle - Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection + (distToGatePrePoint * 2 * Math.sin(Math.PI * 2 + angle - Math.PI / 2)),
                Math.PI * 2 + angle + Math.PI / 2,
                `${obj.text.split("col")[0]}entrance`
            ));
        }

    });

}