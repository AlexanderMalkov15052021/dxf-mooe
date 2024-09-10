import { distToCahePoint, maxDist, scaleCorrection } from "@/constants";
import { cachePoint } from "@/helpers/elements/cachePoint";
import { pallet } from "@/helpers/elements/pallet";
// import { targetPoint } from "@/helpers/elements/targetPoint";
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
            pointX + (distToCahePoint * Math.cos(angle)),
            pointY + (distToCahePoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}Cache`
        ));

        // mooeDoc.mLaneMarks.push(targetPoint(
        //     linesLength + index + palletesLength * 2,
        //     pointX + (distToTargrtPoint * Math.cos(angle)),
        //     pointY + (distToTargrtPoint * Math.sin(angle)),
        //     angle,
        //     `${obj.text.replace(" ", "")}Target1`
        // ));

        // mooeDoc.mLaneMarks.push(targetPoint(
        //     linesLength + index + palletesLength * 3,
        //     lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(Math.PI * 2 - angle + Math.PI / 2)),
        //     lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(Math.PI * 2 - angle + Math.PI / 2)),
        //     Math.PI * 2 - angle + Math.PI / 2,
        //     `${obj.text.replace(" ", "")}Target2`
        // ));

    });
}