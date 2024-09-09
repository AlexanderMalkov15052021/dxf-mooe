export const getDirRoad = (str: string) => {

    const strMatches = str.match(/вперёд|назад/gi);

    const dir = strMatches ? strMatches[0] : null;

    switch (dir) {
        case "вперёд":
            return 1;
        case "назад":
            return 2;
        default:
            return 0;
    }
}