import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setArc } from "../insert/setArc";
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";

export const getMooe = (dxf: IDxf) => {

    const {
        store: { mooeDoc },
    } = ConverterStor;

    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");
    const streamPallets = dxf?.entities.filter((obj: any) => obj.type === "MTEXT" && obj.text.slice(0, 2) !== "GT");
    const gatePallets = dxf?.entities.filter((obj: any) => obj.type === "MTEXT" && obj.text.slice(0, 2) === "GT");
    const palletLines = dxf?.entities.filter((obj: any) => obj.layer.includes("Маршрут к поддону"));

    setLines(mooeDoc, lines);

    setArc(mooeDoc, arc, lines.length * 4 + 1, streamPallets.length * 4);

    setStreamPallets(mooeDoc, streamPallets, palletLines, lines.length * 4 + 1, streamPallets.length);

    setGatePallets(mooeDoc, gatePallets, palletLines, lines.length * 4 + 1 + streamPallets.length * 4, streamPallets.length);

    return mooeDoc;

}