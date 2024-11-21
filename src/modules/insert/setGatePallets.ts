import { distToGateCachePoint, distToTargrtPoint, maxDist, scaleCorrection } from "@/constants";
import { cachePoint } from "@/helpers/elements/cachePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline, getDistTwoPoints, getPerpendicularBase } from "@/helpers/math";
import { Coords, MooeDoc } from "@/types";

export const setGatePallets = (
    mooeDoc: MooeDoc, dxfIdsList: Record<string, string[]>, palletes: any, palletLines: any, lines: any, origin: Coords
) => {

    const linesAndPallets = palletes.reduce((accum: any, pallet: any) => {

        const lineData = palletLines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                (pallet.position.x + origin.x) * scaleCorrection,
                (pallet.position.y + origin.y) * scaleCorrection,
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


        const pointData = (mooeDoc.mLaneMarks as any).reduce((accum: { dist: number, point: any }, point: any) => {

            const dist = getDistTwoPoints(
                lineData.line.vertices[1].x * scaleCorrection,
                lineData.line.vertices[1].y * scaleCorrection,
                point.mLaneMarkXYZW.x,
                point.mLaneMarkXYZW.y
            );

            if (dist < accum.dist) {
                accum.dist = dist;
                accum.point = point;
            }

            return accum;

        }, { dist: maxDist, point: null });


        const counter = (mooeDoc.mRoads as any).reduce((accum: number, road: any) => {

            pointData.point.mLaneMarkID === road.mLanes[0].mStartPos && accum++;
            pointData.point.mLaneMarkID === road.mLanes[0].mEndPos && accum++;

            return accum;

        }, 0);

        const angle = getAtan2(
            lineData.line.vertices[0].x,
            lineData.line.vertices[0].y,
            lineData.line.vertices[1].x,
            lineData.line.vertices[1].y
        );


        accum[pallet.text] = {
            pallet,
            line: lineData.line,
            baseLine: counter > 2 ? lineData.line : null,
            basePallet: counter > 2 ? pallet : null,
            angle,
        }

        if (counter > 2) {

            accum[pallet.text.split("row")[0]] = {
                baseLine: null,
                basePallet: null,
            }

            accum[pallet.text.split("row")[0]].baseLine = lineData.line;
            accum[pallet.text.split("row")[0]].basePallet = pallet
        }

        return accum;

    }, {});

    const targetLinesAndPallets = Object.keys(linesAndPallets).reduce((accum: any, key: string) => {

        if (key.includes("row")) {

            accum[key] = linesAndPallets[key];

            accum[key].baseLine = linesAndPallets[key.split("row")[0]].baseLine;
            accum[key].basePallet = linesAndPallets[key.split("row")[0]].basePallet;

        }

        return accum;

    }, {});


    Object.keys(targetLinesAndPallets).map((key: string) => {

        const pointX = targetLinesAndPallets[key].pallet.position.x * scaleCorrection;
        const pointY = targetLinesAndPallets[key].pallet.position.y * scaleCorrection;

        const basePointX = targetLinesAndPallets[key].basePallet.position.x * scaleCorrection;
        const basePointY = targetLinesAndPallets[key].basePallet.position.y * scaleCorrection;

        const targetLineData = lines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                targetLinesAndPallets[key].baseLine.vertices[1].x * scaleCorrection - ((distToTargrtPoint / 2)
                    * Math.cos(targetLinesAndPallets[key].angle + Math.PI / 2)),
                targetLinesAndPallets[key].baseLine.vertices[1].y * scaleCorrection - ((distToTargrtPoint / 2)
                    * Math.sin(targetLinesAndPallets[key].angle + Math.PI / 2)),
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
            targetLinesAndPallets[key].line.vertices[0].x * scaleCorrection,
            targetLinesAndPallets[key].line.vertices[0].y * scaleCorrection,
            targetLinesAndPallets[key].line.vertices[1].x * scaleCorrection,
            targetLinesAndPallets[key].line.vertices[1].y * scaleCorrection
        );

        const perpendicularBase = getPerpendicularBase(
            targetLinesAndPallets[key].line.vertices[0],
            targetLinesAndPallets[key].line.vertices[1],
            pointX,
            pointY
        );

        const angleToBasePoint = getAtan2(
            pointX,
            pointY,
            perpendicularBase.x,
            perpendicularBase.y
        );


        const ids = dxfIdsList[linesAndPallets[key].pallet.handle];

        mooeDoc.mLaneMarks.push(windingPoint(
            ids ? Number(ids[0]) : 0,
            angleToBasePoint ? pointX + (distToRoad * Math.cos(angleToBasePoint)) : pointX,
            angleToBasePoint ? pointY + (distToRoad * Math.sin(angleToBasePoint)) : pointY,
            targetLinesAndPallets[key].angle,
            key.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(cachePoint(
            ids ? Number(ids[2]) : 0,
            pointX + (distToGateCachePoint * Math.cos(targetLinesAndPallets[key].angle)),
            pointY + (distToGateCachePoint * Math.sin(targetLinesAndPallets[key].angle)),
            targetLinesAndPallets[key].angle,
            `${key.replace(" ", "")}识别`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            ids ? Number(ids[3]) : 0,
            targetLinesAndPallets[key].baseLine.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(targetAngle)),
            targetLinesAndPallets[key].baseLine.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(targetAngle)),
            targetAngle,
            `${key.replace(" ", "")}前置点`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            ids ? Number(ids[1]) : 0,
            basePointX + (distToGateCachePoint * Math.cos(targetLinesAndPallets[key].angle)),
            basePointY + (distToGateCachePoint * Math.sin(targetLinesAndPallets[key].angle)),
            targetLinesAndPallets[key].angle,
            `${key.replace(" ", "")}检`
        ));

    });

}