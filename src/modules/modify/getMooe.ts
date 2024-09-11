import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setArc } from "../insert/setArc";
import { setStreamPallets } from "../insert/setStreamPallets";
import { setGatePallets } from "../insert/setGatePallets";
import { setLayerSize } from "../insert/setLayerSize";
import { setRestPoints } from "../insert/setRestPoints";
import { setChargePoints } from "../insert/setChargePoints";

export const getMooe = (dxf: IDxf) => {

    const {
        store: { mooeDoc },
    } = ConverterStor;

    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");

    const streamPallets = dxf?.entities.filter(
        (obj: any) => obj.type === "MTEXT" && obj.text.slice(0, 2) !== "GT" && obj.layer === "Паллеты"
    );

    const gatePallets = dxf?.entities.filter((obj: any) => obj.type === "MTEXT" && obj.text.slice(0, 2) === "GT");
    const rests = dxf?.entities.filter((obj: any) => obj.type === "MTEXT" && obj.layer === "REST" && !obj.text.includes("Charge"));
    const chargePoints = dxf?.entities.filter((obj: any) => obj.type === "MTEXT" && obj.text.includes("Charge"));

    const palletLines = dxf?.entities.filter((obj: any) => obj.layer.includes("Маршрут к поддону"));
    const restLines = dxf?.entities.filter((obj: any) => obj.type === "LINE" && obj.layer === "REST");
    const chargeLines = dxf?.entities.filter((obj: any) => obj.type === "LINE" && obj.layer === "Charge");

    const layer = dxf?.entities.find((obj: any) => obj.layer.includes("Подложка"));

    setLines(mooeDoc, lines);
    setArc(mooeDoc, arc, lines.length * 4 + 1, streamPallets.length * 4);

    setStreamPallets(mooeDoc, streamPallets, palletLines, lines.length * 4 + 1, streamPallets.length);
    setGatePallets(mooeDoc, gatePallets, palletLines, lines.length * 4 + 1 + streamPallets.length * 4, streamPallets.length);

    setRestPoints(mooeDoc, rests, restLines, lines.length * 4 + 1 + streamPallets.length * 8, streamPallets.length);
    setChargePoints(mooeDoc, chargePoints, chargeLines, lines.length * 4 + 1 + streamPallets.length * 14, streamPallets.length);

    setLayerSize(mooeDoc, layer);

    return mooeDoc;

}