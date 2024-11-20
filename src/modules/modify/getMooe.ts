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
import { setNewIds } from "../insert/setNewIds";

export const getMooe = (dxf: IDxf, dxfIdsList: Record<string, string[]>, mooeDoc: MooeDoc, permission: string, inaccuracy: string) => {

    const numPerm = Number(permission);
    const numInc = Number(inaccuracy);

    const DXFData = getDXFData(dxf);

    const lines = [...DXFData.lines, ...DXFData.chargeLines, ...DXFData.restLines, ...DXFData.palletLines, ...DXFData.gateLines];

    const linePointsDiapason = setLines(mooeDoc, dxfIdsList, lines, numPerm, numInc, DXFData.origin);
    const cubicSplinePointsDiapason = setCubicSpline(mooeDoc, DXFData.cubicSpline, numPerm, numInc, DXFData.origin);
    const quadraticSplinePointsDiapason = setQuadraticSpline(mooeDoc, DXFData.quadraticSpline, numPerm, numInc, DXFData.origin);

    DXFData.streamPallets && setStreamPallets(mooeDoc, DXFData.streamPallets, DXFData.palletLines, lines, DXFData.origin);
    DXFData.gatePallets && setGatePallets(mooeDoc, DXFData.gatePallets, DXFData.gateLines, lines, DXFData.origin);
    DXFData.rests && setRestPoints(mooeDoc, DXFData.rests, DXFData.restLines, lines, DXFData.origin);
    DXFData.chargeLines && setChargePoints(mooeDoc, DXFData.charges, DXFData.chargeLines, lines, DXFData.origin);

    DXFData.targetPoints && setTargetPoints(mooeDoc, DXFData.targetPoints, lines, DXFData.origin);

    DXFData.layer && setLayerSize(mooeDoc, DXFData.layer, DXFData.origin);

    setNewIds(mooeDoc);

    return { mooeDoc, diapasonPoints: [...linePointsDiapason, ...cubicSplinePointsDiapason, ...quadraticSplinePointsDiapason] };

}