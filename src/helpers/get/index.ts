import { getStrFromHex } from "../math";

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

export const getRoadAndLaneIds = (id: string, roadsLength: number, roadId: number, laneId: number) => {

    if (id.includes("66697865642069643a20")) {
        const cadId = getStrFromHex(id);

        const twoId = cadId.replace("fixed id: ", "");

        const ids = twoId.split(" ");

        return [
            Number(ids[0]),
            Number(ids[1])
        ];
    }
    else {
        return [
            roadsLength + roadId,
            roadsLength + laneId
        ];
    }

}

export const getRestingAndPointsIds = (id: string, pointsLength: number, firstPointId: number) => {

    if (id.includes("66697865642069643a20")) {
        const cadId = getStrFromHex(id);

        const twoId = cadId.replace("fixed id: ", "");

        const ids = twoId.split(" ");

        return [
            Number(ids[0]),
            Number(ids[1]),
            Number(ids[2])
        ];
    }
    else {
        return [
            pointsLength + firstPointId,
            pointsLength + firstPointId + 1,
            pointsLength + firstPointId + 2,
        ];
    }

}

export const getDxfIdsList = (docStr: string) => {

    const dividerStr = "fixed id: ";

    if (!docStr.includes(dividerStr)) {
        return {};
    }

    const lineBreak = "\n";
    const dividerLength = dividerStr.length;

    const targetDocStr = docStr.substring(docStr.indexOf(dividerStr) + dividerLength);
    const docStrParts = targetDocStr.split(dividerStr);

    const ids = docStrParts.map((str: string) => str.substring(0, str.indexOf(lineBreak)).split(" "));

    return ids.reduce((accum: Record<string, string[]>, arr: string[]) => {

        const [first, ...rest] = arr;

        accum[first] = [...rest];

        return accum;
    }, {});
}