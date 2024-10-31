import { Coords } from "@/types";
import { IDxf, IViewPort } from "dxf-parser";

type DXFDataType = {
    quadraticSpline: any;
    streamPallets: any;
    targetPoints: any;
    gatePallets: any;
    palletLines: any;
    chargeLines: any;
    cubicSpline: any;
    gateLines: any;
    restLines: any;
    charges: any;
    lines: any;
    rests: any;
    layer: any;
};

export const getDXFData = (dxf: IDxf) => {

    const entities = dxf?.entities.reduce<DXFDataType>((accum: any, obj: any) => {

        obj.layer === "Quadratic spline roads" && accum.quadraticSpline.push(obj);
        obj.layer === "Cubic spline roads" && accum.cubicSpline.push(obj);
        obj.layer === "Layer" && (accum.layer = obj);
        obj.layer === "Rest points" && accum.rests.push(obj);

        obj.layer === "Straight roads" && accum.lines.push(obj);
        obj.layer === "Bidirectional roads" && accum.lines.push(obj);

        obj.layer === "Charge points" && accum.charges.push(obj);
        obj.layer === "Charge roads" && accum.chargeLines.push(obj);
        obj.layer === "Rest roads" && accum.restLines.push(obj);
        obj.layer === "Pallet roads" && accum.palletLines.push(obj);
        obj.layer === "Flow roads" && accum.gateLines.push(obj);

        obj.layer === "Flow pallets" && accum.gatePallets.push(obj);
        obj.layer === "Alley pallets" && accum.streamPallets.push(obj);

        obj.layer === "Target points" && accum.targetPoints.push(obj);

        return accum;
    }, {
        quadraticSpline: [],
        streamPallets: [],
        targetPoints: [],
        gatePallets: [],
        palletLines: [],
        chargeLines: [],
        cubicSpline: [],
        gateLines: [],
        restLines: [],
        charges: [],
        lines: [],
        rests: [],
        layer: null,
    });

    const viewPorts: IViewPort[] = dxf?.tables?.viewPort?.viewPorts;

    const origin: Coords = viewPorts.length
        ? {
            x: dxf.tables.viewPort.viewPorts[0].ucsOrigin.x * -1,
            y: dxf.tables.viewPort.viewPorts[0].ucsOrigin.y * -1,
            z: dxf.tables.viewPort.viewPorts[0].ucsOrigin.z * -1
        }
        : { x: 0, y: 0, z: 0 };

    return { ...entities, origin }

}