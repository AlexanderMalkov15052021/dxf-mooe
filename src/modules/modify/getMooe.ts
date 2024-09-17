import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setSplines } from "../insert/setSplines";
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";
import { setLayerSize } from "../insert/setLayerSize";
import { setRestPoints } from "../insert/setRestPoints";
import { setChargePoints } from "../insert/setChargePoints";
import { getDXFData } from "../extract/getDXFData";

export const getMooe = (dxf: IDxf) => {

    const { store: { mooeDoc } } = ConverterStor;

    const DXFData = getDXFData(dxf);

    const lineLength = DXFData.lines.length * 4 + 1;

    setLines(mooeDoc, DXFData.lines);
    setSplines(mooeDoc, DXFData.spline, lineLength);
    setStreamPallets(mooeDoc, DXFData.streamPallets, DXFData.palletLines, lineLength, DXFData.spline.length);
    setGatePallets(mooeDoc, DXFData.gatePallets, DXFData.gateLines, lineLength * 4, DXFData.spline.length);
    setRestPoints(mooeDoc, DXFData.rests, DXFData.restLines, lineLength * 8, DXFData.spline.length);
    setChargePoints(mooeDoc, DXFData.charges, DXFData.chargeLines, lineLength * 14, DXFData.spline.length);

    setLayerSize(mooeDoc, DXFData.layer);

    return mooeDoc;

}