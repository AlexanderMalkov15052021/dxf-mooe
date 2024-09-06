import { curveRoad } from "@/helpers/elements/curveRoad";
import { pallet } from "@/helpers/elements/pallet";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { getDistancePoints } from "@/helpers/math";
import { IDxf } from "dxf-parser";

const scale = .0005;

export const getMooe = (dxf: IDxf) => {

    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");
    const pallete = dxf?.entities.filter((obj: any) => obj.type === "MTEXT");

    lines?.map((obj: any, index: number) => {
        const pointX1 = obj.vertices[0].x * scale
        const pointY1 = obj.vertices[0].y * scale

        const pointX2 = obj.vertices[1].x * scale
        const pointY2 = obj.vertices[1].y * scale

        const startId = 0 + (index * 3);
        const endId = 1 + (index * 3);
        const roadId = 2 + (index * 3);

        (emptyMooe.mLaneMarks as any).push(roadPoint(startId, pointX1, pointY1, Math.PI / 2));
        (emptyMooe.mLaneMarks as any).push(roadPoint(endId, pointX2, pointY2, Math.PI / 2));

        (emptyMooe.mRoads as any).push(road(
            startId,
            endId,
            { x: pointX1, y: pointY1 },
            { x: pointX2, y: pointY2 },
            roadId,
            Math.PI / 2,
            0
        ));

    });

    pallete?.map((obj: any, index: number) => {

        (emptyMooe.mLaneMarks as any).push(pallet(
            lines.length * 3 + index,
            obj.position.x * scale,
            obj.position.y * scale,
            Math.PI / 2,
            obj.text
        ));

    });

    arc?.map((obj: any, index: number) => {

        const centerX = obj.center.x * scale;
        const centerY = obj.center.y * scale;

        const pointsData = emptyMooe.mLaneMarks.map((point: any) => {

            const pX = point.mLaneMarkXYZW.x;
            const pY = point.mLaneMarkXYZW.y;

            const dist = getDistancePoints(centerX, centerY, pX, pY);

            return {
                dist,
                point
            }
        }).sort((a, b) => a.dist - b.dist).slice(0, 2);

        (emptyMooe.mRoads as any).push(curveRoad(
            pointsData[0].point.mLaneMarkID,
            pointsData[1].point.mLaneMarkID,
            { x: pointsData[0].point.mLaneMarkXYZW.x, y: pointsData[0].point.mLaneMarkXYZW.y },
            { x: pointsData[1].point.mLaneMarkXYZW.x, y: pointsData[1].point.mLaneMarkXYZW.y },
            lines.length * 3 + index + pallete.length,
            Math.PI / 2,
            0,
            { x: obj.center.x * scale, y: obj.center.y * scale },
            lines.length * 3 + index + pallete.length + arc.length
        ));


    });

    return emptyMooe;

}