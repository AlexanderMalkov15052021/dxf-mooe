import { inaccuracy, maxDist, scaleCorrection } from "@/constants";
import { ConverterStor } from "@/entities";
import { curveRoad } from "@/helpers/elements/curveRoad";
import { pallet } from "@/helpers/elements/pallet";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
// import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { getDirRoad } from "@/helpers/get";
import { getAtan2, getDistancePoints, getDistTwoPoints, isNearestPoints, getDistPointToline } from "@/helpers/math";
import { IDxf } from "dxf-parser";

export const getMooe = (dxf: IDxf) => {

    const {
        store: { mooeDoc },
    } = ConverterStor;

    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");
    const pallete = dxf?.entities.filter((obj: any) => obj.type === "MTEXT");
    const palletLines = dxf?.entities.filter((obj: any) => obj.layer.includes("Маршрут к поддону"));

    lines?.map((obj: any, index: number) => {
        const pointX1 = obj.vertices[0].x * scaleCorrection
        const pointY1 = obj.vertices[0].y * scaleCorrection

        const pointX2 = obj.vertices[1].x * scaleCorrection
        const pointY2 = obj.vertices[1].y * scaleCorrection

        const startId = 0 + (index * 4);
        const endId = 1 + (index * 4);
        const laneId = 2 + (index * 4);
        const roadId = 3 + (index * 4);

        const obj1 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX1, pointY1, inaccuracy)
        );
        const obj2 = mooeDoc.mLaneMarks.find(
            (obj: any) => isNearestPoints(obj.mLaneMarkXYZW.x, obj.mLaneMarkXYZW.y, pointX2, pointY2, inaccuracy)
        );

        !obj1 && mooeDoc.mLaneMarks.push(roadPoint(startId, pointX1, pointY1, Math.PI / 2));
        !obj2 && mooeDoc.mLaneMarks.push(roadPoint(endId, pointX2, pointY2, Math.PI / 2));

        mooeDoc.mRoads.push(road(
            !obj1 ? startId : obj1.mLaneMarkID,
            !obj2 ? endId : obj2.mLaneMarkID,
            !obj1 ? { x: pointX1, y: pointY1 } : { x: obj1?.mLaneMarkXYZW.x, y: obj1?.mLaneMarkXYZW.y },
            !obj2 ? { x: pointX2, y: pointY2 } : { x: obj2?.mLaneMarkXYZW.x, y: obj2?.mLaneMarkXYZW.y },
            laneId,
            Math.PI / 2,
            getDirRoad(obj.layer),
            roadId
        ));



    });


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
            lines.length * 4 + index,
            pointX,
            pointY,
            angle,
            obj.text.replace(" ", "")
        ));

    });

    arc?.map((obj: any, index: number) => {

        const centerX = obj.center.x * scaleCorrection;
        const centerY = obj.center.y * scaleCorrection;

        const pointsData = mooeDoc.mLaneMarks.map((point: any) => {

            const pX = point.mLaneMarkXYZW.x;
            const pY = point.mLaneMarkXYZW.y;

            const dist = getDistancePoints(centerX, centerY, pX, pY);

            return {
                dist,
                point
            }
        }).sort((a, b) => a.dist - b.dist).slice(0, 2);

        const middleX = (pointsData[0].point.mLaneMarkXYZW.x + pointsData[1].point.mLaneMarkXYZW.x) / 2;
        const middleY = (pointsData[0].point.mLaneMarkXYZW.y + pointsData[1].point.mLaneMarkXYZW.y) / 2;

        const radius = getDistTwoPoints(middleX, middleY, centerX, centerY);

        const angle = getAtan2(
            centerX,
            centerY,
            middleX,
            middleY
        );

        const targetX = middleX + (radius * Math.cos(angle));
        const targetY = middleY + (radius * Math.sin(angle));

        mooeDoc.mRoads.push(curveRoad(
            pointsData[0].point.mLaneMarkID,
            pointsData[1].point.mLaneMarkID,
            { x: pointsData[0].point.mLaneMarkXYZW.x, y: pointsData[0].point.mLaneMarkXYZW.y },
            { x: pointsData[1].point.mLaneMarkXYZW.x, y: pointsData[1].point.mLaneMarkXYZW.y },
            lines.length * 4 + index + pallete.length,
            Math.PI / 2,
            0,
            { x: targetX, y: targetY },
            lines.length * 4 + index + pallete.length + arc.length
        ));

    });

    return mooeDoc;

}