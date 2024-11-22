import { firstLaneId, firstPointId, firstRoadId, valuesRange } from "@/constants";
import { getStrFromHex } from "../math";
import { dxfIdsBuff, DxfIdsData } from "@/types";

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

export const getDxfIdsData = (docStr: string): DxfIdsData => {

    const dividerStr = "fixed id: ";

    if (!docStr.includes(dividerStr)) {
        return {
            dxfIdsList: {},
            dxfIdsBuff: {
                roadIds: [],
                laneIds: [],
                pointIds: []
            }
        }
    }

    const lineBreak = "\n";
    const dividerLength = dividerStr.length;

    const targetDocStr = docStr.substring(docStr.indexOf(dividerStr) + dividerLength);
    const docStrParts = targetDocStr.split(dividerStr);

    const ids = docStrParts.map((str: string) => str.substring(0, str.indexOf(lineBreak)).split(" "));

    const dxfIds = ids.reduce((
        accum: {
            dxfIdsList: Record<string, string[]>,
            objIds: {
                roadIds: number[],
                laneIds: number[],
                pointIds: number[]
            }
        },
        arr: string[]
    ) => {

        const [first, second, ...rest] = arr;

        accum.dxfIdsList[second] = [...rest];

        if (first === "road") {
            accum.objIds.roadIds.push(Number(rest[0]));
            accum.objIds.laneIds.push(Number(rest[1]));
            accum.objIds.pointIds.push(Number(rest[2]), Number(rest[3]));

            
        }

        if (first === "point") {
            accum.objIds.pointIds.push(...rest.map(id => Number(id)));
        }

        return accum;
    }, {
        dxfIdsList: {},
        objIds: {
            roadIds: [],
            laneIds: [],
            pointIds: []
        }
    });

    const dxfIdsBuff: dxfIdsBuff = {
        roadIds: [],
        laneIds: [],
        pointIds: [],
    };

    const bufferRoadsIds = Array.from({ length: valuesRange }, (_, index) => index + firstRoadId);
    const bufferLanesIds = Array.from({ length: valuesRange }, (_, index) => index + firstLaneId);
    const bufferPointsIds = Array.from({ length: valuesRange }, (_, index) => index + firstPointId);

    dxfIdsBuff.roadIds = bufferRoadsIds.filter((id: number) => !dxfIds.objIds.roadIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.laneIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.pointIds?.includes(id));

    dxfIdsBuff.laneIds = bufferLanesIds.filter((id: number) => !dxfIds.objIds.roadIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.laneIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.pointIds?.includes(id));

    dxfIdsBuff.pointIds = [...new Set(bufferPointsIds.filter((id: number) => !dxfIds.objIds.roadIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.laneIds?.includes(id))
        .filter((id: number) => !dxfIds.objIds.pointIds?.includes(id)))];

    const result: DxfIdsData = { dxfIdsList: dxfIds.dxfIdsList, dxfIdsBuff };

    return result;
}