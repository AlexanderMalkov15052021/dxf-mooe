export const getDistTwoPoints = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);

export const getDistancePoints = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));