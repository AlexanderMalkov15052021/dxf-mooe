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