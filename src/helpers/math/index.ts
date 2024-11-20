import { scaleCorrection } from "@/constants";
import { Coords2D } from "@/types";

export const getDistTwoPoints = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);

export const isNearestPoints = (x1: number, y1: number, x2: number, y2: number, inac: number) => Math.hypot(x2 - x1, y2 - y1) < inac;

export const getDistancePoints = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

export const getAtan2 = (x1: number, y1: number, x2: number, y2: number) => {
    const dy = y2 - y1;
    const dx = x2 - x1;
    const res = Math.atan2(dy, dx);

    return res;
}

export const getRoundedNumber = (value: number, rounding: number) => Math.round(value * rounding) / rounding;

export const getDistPointToline = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {

    let A = x - x1;
    let B = y - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0)
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

export const getAngleToLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) =>
    (Math.atan2(y3 - y1, x3 - x1) - Math.atan2(y2 - y1, x2 - x1));

export const getPerpendicularBase = (startPoint: Coords2D, endPoint: Coords2D, pointX: number, pointY: number) => {

    const startPointX = startPoint.x * scaleCorrection;
    const startPointY = startPoint.y * scaleCorrection;

    const distX = endPoint.x * scaleCorrection - startPointX;
    const distY = endPoint.y * scaleCorrection - startPointY;

    const powX = Math.pow(distX, 2);
    const powY = Math.pow(distY, 2);

    const x4 = (distX * distY * (pointY - startPointY) + startPointX * powY + pointX * powX) / (powY + powX);

    const y4 = distY * (x4 - startPointX) / (distX) + startPointY;

    return { x: x4, y: y4 }
}

// декодировать hex в строку
export const getStrFromHex = (hex: string) => {
    const encodeArr = hex.match(/.{1,2}/g);
    const encodeStr = encodeArr ? encodeArr.join('%') : "";

    return decodeURIComponent('%' + encodeStr);
}

// декодировать строку в hex
export const getHexFromStr = (str: string) => {
    const encoder = new TextEncoder();

    return Array.from(encoder.encode(str)).map(b => b.toString(16).padStart(2, '0')).join('')
}