import { firstPointId, maxDist, scaleCorrection } from "@/constants";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { getAtan2, getDistPointToline } from "@/helpers/math";
import { Coords, MooeDoc } from "@/types";

export const setTargetPoints = (mooeDoc: MooeDoc, targetPoints: any, lines: any, origin: Coords) => {

    targetPoints?.map((obj: any) => {

        const pointX = (obj.position.x + origin.x) * scaleCorrection;
        const pointY = (obj.position.y + origin.y) * scaleCorrection;

        const lineData = lines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                pointX,
                pointY,
                (line.vertices[0].x + origin.x) * scaleCorrection,
                (line.vertices[0].y + origin.y) * scaleCorrection,
                (line.vertices[1].x + origin.x) * scaleCorrection,
                (line.vertices[1].y + origin.y) * scaleCorrection
            );

            if (dist < accum.dist) {
                accum.dist = dist;
                accum.line = {
                    ...line, vertices: [
                        { x: line.vertices[0].x + origin.x, y: line.vertices[0].y + origin.y },
                        { x: line.vertices[1].x + origin.x, y: line.vertices[1].y + origin.y }
                    ]
                };;
            }

            return accum;

        }, { dist: maxDist, line: null });

        const angle = getAtan2(
            lineData.line.vertices[0].x,
            lineData.line.vertices[0].y,
            lineData.line.vertices[1].x,
            lineData.line.vertices[1].y
        );

        mooeDoc.mLaneMarks.push(targetPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX,
            pointY,
            angle,
            `${obj.text.replace(" ", "")}`
        ));

    });
}