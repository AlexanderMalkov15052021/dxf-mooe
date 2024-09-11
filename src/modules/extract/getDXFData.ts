import { IDxf } from "dxf-parser";

type DXFDataType = {
    streamPallets: any;
    gatePallets: any;
    palletLines: any;
    chargeLines: any;
    restLines: any;
    charges: any;
    lines: any;
    rests: any;
    layer: any;
    arc: any;
};

export const getDXFData = (dxf: IDxf) => {

    return dxf?.entities.reduce<DXFDataType>((accum: any, obj: any) => {

        obj.type === "ARC" && accum.arc.push(obj);
        obj.type === "LINE" && accum.lines.push(obj);
        obj.layer.includes("Подложка") && (accum.layer = obj);
        obj.layer.includes("Маршрут к поддону") && accum.palletLines.push(obj);
        obj.type === "LINE" && obj.layer === "REST" && accum.restLines.push(obj);
        obj.type === "LINE" && obj.layer === "Charge" && accum.chargeLines.push(obj);
        obj.type === "MTEXT" && obj.text.includes("Charge") && accum.charges.push(obj);
        obj.type === "MTEXT" && obj.text.slice(0, 2) === "GT" && accum.gatePallets.push(obj);
        obj.type === "MTEXT" && obj.layer === "REST" && !obj.text.includes("Charge") && accum.rests.push(obj);
        obj.type === "MTEXT" && obj.text.slice(0, 2) !== "GT" && obj.layer === "Паллеты" && accum.streamPallets.push(obj);

        return accum;
    }, {
        streamPallets: [],
        gatePallets: [],
        palletLines: [],
        chargeLines: [],
        restLines: [],
        charges: [],
        lines: [],
        rests: [],
        arc: [],
        layer: null,
    });

}