import { distToTargrtPoint, maxDist, scaleCorrection } from "@/constants";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline, getPerpendicularBase } from "@/helpers/math";
import { Coords, MooeDoc } from "@/types";

export const setRestPoints = (
    mooeDoc: MooeDoc, dxfIdsList: Record<string, string[]>, rests: any, restLines: any, lines: any, origin: Coords
) => {
    rests?.map((obj: any) => {

        const pointX = (obj.position.x + origin.x) * scaleCorrection;
        const pointY = (obj.position.y + origin.y) * scaleCorrection;

        const lineData = restLines.reduce((accum: { dist: number, line: any }, line: any) => {

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
                };
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
                lineData.line.vertices[1].x * scaleCorrection - ((distToTargrtPoint / 2) * Math.cos(angle + Math.PI / 2)),
                lineData.line.vertices[1].y * scaleCorrection - ((distToTargrtPoint / 2) * Math.sin(angle + Math.PI / 2)),
                (line.vertices[0].x + origin.x) * scaleCorrection,
                (line.vertices[0].y + origin.y) * scaleCorrection,
                (line.vertices[1].x + origin.x) * scaleCorrection,
                (line.vertices[1].y + origin.y) * scaleCorrection
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

        const distToRoad = getDistPointToline(
            pointX,
            pointY,
            lineData.line.vertices[0].x * scaleCorrection,
            lineData.line.vertices[0].y * scaleCorrection,
            lineData.line.vertices[1].x * scaleCorrection,
            lineData.line.vertices[1].y * scaleCorrection
        );

        const perpendicularBase = getPerpendicularBase(lineData.line.vertices[0], lineData.line.vertices[1], pointX, pointY);

        const angleToBasePoint = getAtan2(
            pointX,
            pointY,
            perpendicularBase.x,
            perpendicularBase.y
        );

        const ids = dxfIdsList[obj.handle];

        mooeDoc.mLaneMarks.push(windingPoint(
            ids ? Number(ids[0]) : 0,
            angleToBasePoint ? pointX + (distToRoad * Math.cos(angleToBasePoint)) : pointX,
            angleToBasePoint ? pointY + (distToRoad * Math.sin(angleToBasePoint)) : pointY,
            angle,
            obj.text.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            ids ? Number(ids[1]) : 0,
            pointX + (distToTargrtPoint * Math.cos(angle)),
            pointY + (distToTargrtPoint * Math.sin(angle)),
            angle,
            `${obj.text.replace(" ", "")}检`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            ids ? Number(ids[2]) : 0,
            lineData.line.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(targetAngle)),
            lineData.line.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(targetAngle)),
            targetAngle,
            `${obj.text.replace(" ", "")}前置点`
        ));

    });
}