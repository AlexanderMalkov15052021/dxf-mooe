import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setArc } from "../insert/setArc";
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";
import { setLayerSize } from "../insert/setLayerSize";
import { setRestPoints } from "../insert/setRestPoints";
import { setChargePoints } from "../insert/setChargePoints";
import { getDXFData } from "../extract/getDXFData";

export const getMooe = (dxf: IDxf) => {

    const { store: { mooeDoc } } = ConverterStor;

    const { lines, arc, streamPallets, gatePallets, rests, charges, palletLines, restLines, chargeLines, layer } = getDXFData(dxf);

    setLines(mooeDoc, lines);
    setArc(mooeDoc, arc, lines.length * 4 + 1, streamPallets.length * 4);

    setStreamPallets(mooeDoc, streamPallets, palletLines, lines.length * 4 + 1, streamPallets.length);
    setGatePallets(mooeDoc, gatePallets, palletLines, lines.length * 4 + 1 + streamPallets.length * 4, streamPallets.length);

    setRestPoints(mooeDoc, rests, restLines, lines.length * 4 + 1 + streamPallets.length * 8, streamPallets.length);
    setChargePoints(mooeDoc, charges, chargeLines, lines.length * 4 + 1 + streamPallets.length * 14, streamPallets.length);

    setLayerSize(mooeDoc, layer);

    return mooeDoc;

}