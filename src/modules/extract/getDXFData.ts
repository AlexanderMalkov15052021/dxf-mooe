import { IDxf } from "dxf-parser";

type DXFDataType = {
    streamPallets: any;
    gatePallets: any;
    palletLines: any;
    chargeLines: any;
    gateLines: any;
    restLines: any;
    charges: any;
    lines: any;
    rests: any;
    layer: any;
    spline: any;
};

export const getDXFData = (dxf: IDxf) => {

    return dxf?.entities.reduce<DXFDataType>((accum: any, obj: any) => {

        obj.layer === "ARC" && accum.spline.push(obj);
        obj.layer === "Layer" && (accum.layer = obj);
        obj.layer === "Rest" && accum.rests.push(obj);

        obj.type === "LINE" && accum.lines.push(obj);

        obj.layer === "Charge points" && accum.charges.push(obj);
        obj.layer === "Charge roads" && accum.chargeLines.push(obj);
        obj.layer === "Rest roads" && accum.restLines.push(obj);
        obj.layer === "Pallet roads" && accum.palletLines.push(obj);
        obj.layer === "Gtp roads" && accum.gateLines.push(obj);

        obj.text && obj.layer === "Gtp" && obj.text.slice(0, 2) === "GT" && accum.gatePallets.push(obj);
        obj.text && obj.layer === "Pallet" && obj.text.slice(0, 2) !== "GT" && accum.streamPallets.push(obj);

        return accum;
    }, {
        streamPallets: [],
        gatePallets: [],
        palletLines: [],
        chargeLines: [],
        gateLines: [],
        restLines: [],
        charges: [],
        lines: [],
        rests: [],
        spline: [],
        layer: null,
    });

}