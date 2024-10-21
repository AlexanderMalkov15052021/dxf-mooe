import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setQuadraticSpline } from "../insert/setQuadraticSpline";
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";
import { setLayerSize } from "../insert/setLayerSize";
import { setRestPoints } from "../insert/setRestPoints";
import { setChargePoints } from "../insert/setChargePoints";
import { getDXFData } from "../extract/getDXFData";
import { setCubicSpline } from "../insert/setCubicSpline";
import { MooeDoc } from "@/types";

export const getMooe = (dxf: IDxf, mooeDoc: MooeDoc, permission: string, inaccuracy: string) => {

    const numPerm = Number(permission);
    const numInc = Number(inaccuracy);

    const DXFData = getDXFData(dxf);

    const linePointsDiapason = setLines(mooeDoc, DXFData.lines, numPerm, numInc);
    const cubicSplinePointsDiapason = setCubicSpline(mooeDoc, DXFData.cubicSpline, numPerm, numInc);
    const quadraticSplinePointsDiapason = setQuadraticSpline(mooeDoc, DXFData.quadraticSpline, numPerm, numInc);
    setStreamPallets(mooeDoc, DXFData.streamPallets, DXFData.palletLines, DXFData.lines);
    setGatePallets(mooeDoc, DXFData.gatePallets, DXFData.gateLines, DXFData.lines);
    setRestPoints(mooeDoc, DXFData.rests, DXFData.restLines, DXFData.lines);
    setChargePoints(mooeDoc, DXFData.charges, DXFData.chargeLines, DXFData.lines);

    setLayerSize(mooeDoc, DXFData.layer);

    return { mooeDoc, diapasonPoints: [...linePointsDiapason, ...cubicSplinePointsDiapason, ...quadraticSplinePointsDiapason] };

}