import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setQuadraticSpline } from "../insert/setQuadraticSpline"
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";
import { setLayerSize } from "../insert/setLayerSize";
import { setRestPoints } from "../insert/setRestPoints";
import { setChargePoints } from "../insert/setChargePoints";
import { getDXFData } from "../extract/getDXFData";
import { setCubicSpline } from "../insert/setCubicSpline";

export const getMooe = (dxf: IDxf) => {

    const { store: { mooeDoc } } = ConverterStor;

    const DXFData = getDXFData(dxf);

    setLines(mooeDoc, DXFData.lines);
    setCubicSpline(mooeDoc, DXFData.cubicSpline);
    setQuadraticSpline(mooeDoc, DXFData.quadraticSpline);
    setStreamPallets(mooeDoc, DXFData.streamPallets, DXFData.palletLines);
    setGatePallets(mooeDoc, DXFData.gatePallets, DXFData.gateLines);
    setRestPoints(mooeDoc, DXFData.rests, DXFData.restLines);
    setChargePoints(mooeDoc, DXFData.charges, DXFData.chargeLines);

    setLayerSize(mooeDoc, DXFData.layer);

    return mooeDoc;

}