export const getDirRoad = (str: string) => {  // "Маршрут 1 ( R1-R2) ( назад )"

    const strMatches = str.match(/вперёд|назад/gi);  // ["назад"] | ["вперёд"] | null

    const dir = strMatches ? strMatches[0] : null;  // "назад" | "вперёд" | null

    switch (dir) {
        case "вперёд":
            return 1;
        case "назад":
            return 2;
        default:
            return 0;
    }
}