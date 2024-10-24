import { distToEndPointRoad, distToGateCachePoint, distToTargrtPoint, firstPointId, maxDist, scaleCorrection } from "@/constants";
import { cachePoint } from "@/helpers/elements/cachePoint";
import { targetPoint } from "@/helpers/elements/targetPoint";
import { windingPoint } from "@/helpers/elements/windingPoint";
import { getAtan2, getDistPointToline, getDistTwoPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setGatePallets = (mooeDoc: MooeDoc, palletes: any, palletLines: any, lines: any) => {

    const linesAndPallets = palletes.reduce((accum: any, pallet: any) => {

        const lineData = palletLines.reduce((accum: { dist: number, line: any }, line: any) => {

            const dist = getDistPointToline(
                pallet.position.x * scaleCorrection,
                pallet.position.y * scaleCorrection,
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
            pointX + (distToEndPointRoad * Math.cos(targetLinesAndPallets[key].angle)),
            pointY + (distToEndPointRoad * Math.sin(targetLinesAndPallets[key].angle)),
            targetLinesAndPallets[key].angle,
            key.replace(" ", "")
        ));

        mooeDoc.mLaneMarks.push(cachePoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            pointX + ((distToGateCachePoint + distToEndPointRoad) * Math.cos(targetLinesAndPallets[key].angle)),
            pointY + ((distToGateCachePoint + distToEndPointRoad) * Math.sin(targetLinesAndPallets[key].angle)),
            targetLinesAndPallets[key].angle,
            `${key.replace(" ", "")}识别`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            targetLinesAndPallets[key].baseLine.vertices[1].x * scaleCorrection + (distToTargrtPoint * Math.cos(targetAngle)),
            targetLinesAndPallets[key].baseLine.vertices[1].y * scaleCorrection + (distToTargrtPoint * Math.sin(targetAngle)),
            targetAngle,
            `${key.replace(" ", "")}前置点`
        ));

        mooeDoc.mLaneMarks.push(targetPoint(
            mooeDoc.mLaneMarks.length + firstPointId,
            basePointX + ((distToGateCachePoint + distToEndPointRoad) * Math.cos(targetLinesAndPallets[key].angle)),
            basePointY + ((distToGateCachePoint + distToEndPointRoad) * Math.sin(targetLinesAndPallets[key].angle)),
            targetLinesAndPallets[key].angle,
            `${key.replace(" ", "")}检`
        ));

    });

    // const textParts = obj.text.split("col");
    // const gate = textParts[0];
    // const col = textParts[1].split("row")[0];
    // const gateCol = col[0] === "0" ? Number(col[1]) : Number(col);


    // if (obj.text.includes("row09") && gateCols[gate] === gateCol) {
    //     mooeDoc.mLaneMarks.push(prePoint(
    //         mooeDoc.mLaneMarks.length + firstPointId,
    //         lineData.line.vertices[1].x * scaleCorrection + (distToGatePrePoint * 2 * Math.cos(angle + Math.PI / 2)),
    //         lineData.line.vertices[1].y * scaleCorrection + (distToGatePrePoint * 2 * Math.sin(angle + Math.PI / 2)),
    //         angle - Math.PI / 2,
    //         `${obj.text.split("col")[0]}entrance`
    //     ));
    // }

    // });

}