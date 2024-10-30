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
import { setTargetPoints } from "../insert/setTargetPoints";

export const getMooe = (dxf: IDxf, mooeDoc: MooeDoc, permission: string, inaccuracy: string) => {

    const numPerm = Number(permission);
    const numInc = Number(inaccuracy);

    const DXFData = getDXFData(dxf);

    console.log("lines: ", DXFData.lines);
    
    const lines = [...DXFData.lines, ...DXFData.chargeLines, ...DXFData.restLines, ...DXFData.palletLines, ...DXFData.gateLines];

    const linePointsDiapason = setLines(mooeDoc, lines, numPerm, numInc);
    const cubicSplinePointsDiapason = setCubicSpline(mooeDoc, DXFData.cubicSpline, numPerm, numInc);
    const quadraticSplinePointsDiapason = setQuadraticSpline(mooeDoc, DXFData.quadraticSpline, numPerm, numInc);
    
    DXFData.streamPallets && setStreamPallets(mooeDoc, DXFData.streamPallets, DXFData.palletLines, lines);
    DXFData.gatePallets && setGatePallets(mooeDoc, DXFData.gatePallets, DXFData.gateLines, lines);
    DXFData.rests && setRestPoints(mooeDoc, DXFData.rests, DXFData.restLines, lines);
    DXFData.chargeLines && setChargePoints(mooeDoc, DXFData.charges, DXFData.chargeLines, lines);

    DXFData.targetPoints && setTargetPoints(mooeDoc, DXFData.targetPoints, lines);

    DXFData.layer && setLayerSize(mooeDoc, DXFData.layer);

    return { mooeDoc, diapasonPoints: [...linePointsDiapason, ...cubicSplinePointsDiapason, ...quadraticSplinePointsDiapason] };

}