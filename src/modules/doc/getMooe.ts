import { pallet } from "@/helpers/elements/pallet";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { getDistancePoints } from "@/helpers/math";
import { IDxf } from "dxf-parser";

const scale = .0005;

export const getMooe = (dxf: IDxf) => {

    // 2 = 58
    // 1 = 30
    // .5 = 16

    const nodes = [
        { x: 0.64, y: 1.2 },
        { x: 0.91, y: 1.32 },
        { x: 1.06, y: 1 }
        // { x: 0, y: 0.1 },
        // { x: 0.36, y: 0.3 },
        // { x: 0.1, y: 0 }
    ]



    const C = memorize((n: any, k: any) => factorial(n) / (factorial(k) * factorial(n - k)));

    const factorial = memorize((n: any) => (n < 2 ? 1 : n * factorial(n - 1)));

    function memorize(func: any) {
        const history: any = {};

        return function (...args: any) {
            const key = JSON.stringify(args);

            if (!history.hasOwnProperty(key)) {
                const result = func(...args);
                history[key] = result;
            }

            return history[key];
        };
    }



    const getCurve = (nodes: { x: number, y: number }[], step: number) => {
        const result = [];
        const n = nodes.length - 1;

        for (let t = 0; t <= 1; t = Math.min(1, t + step)) {
            const point = {
                x: 0,
                y: 0,
            };

            for (let k = 0; k <= n; k++) {
                const b = C(n, k) * t ** k * (1 - t) ** (n - k);
                const node = nodes[k];

                point.x += node.x * b;
                point.y += node.y * b;
            }

            result.push(point);

            if (t === 1) {
                break;
            }
        }

        return result;
    }

    console.log(getCurve(nodes, 0.07));  // 0.5299549198489513  0.0147  0.03   0.0170   0.0205

    const x1 = 0;
    const y1 = 1;
    const x2 = 1;
    const y2 = 0;

    console.log("dist: ", getDistancePoints(x1, y1, x2, y2));  // 0.04792082543539437 0.041948644158729835 0.03601517130944899



    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    // const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");
    const pallete = dxf?.entities.filter((obj: any) => obj.type === "MTEXT");

    lines?.map((obj: any, index: number) => {
        const pointX1 = obj.vertices[0].x * scale
        const pointY1 = obj.vertices[0].y * scale

        const pointX2 = obj.vertices[1].x * scale
        const pointY2 = obj.vertices[1].y * scale

        const startId = 0 + (index * 3);
        const endId = 1 + (index * 3);
        const roadId = 2 + (index * 3);

        // const dist = getDistTwoPoints(pointX1, pointY1, pointX2, pointY2);

        // if (dist > .1) {
        (emptyMooe.mLaneMarks as any).push(roadPoint(startId, pointX1, pointY1, Math.PI / 2));
        (emptyMooe.mLaneMarks as any).push(roadPoint(endId, pointX2, pointY2, Math.PI / 2));

        (emptyMooe.mRoads as any).push(road(
            startId,
            endId,
            { x: pointX1, y: pointY1, id: startId },
            { x: pointX2, y: pointY2, id: endId },
            roadId,
            Math.PI / 2,
            0
        ));
        // }

    });


    pallete?.map((obj: any, index: number) => {

        (emptyMooe.mLaneMarks as any).push(pallet(
            1,
            lines.length * 3 + index,
            1,
            index,
            obj.position.x * scale,
            obj.position.y * scale,
            Math.PI / 2,
            obj.text
        ));

    });

    return emptyMooe;

}