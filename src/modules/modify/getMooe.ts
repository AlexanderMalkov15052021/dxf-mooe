import { ConverterStor } from "@/entities";
import { IDxf } from "dxf-parser";
import { setLines } from "../insert/setLines";
import { setArc } from "../insert/setArc";
import { setPalletes } from "../insert/setPalletes";

export const getMooe = (dxf: IDxf) => {

    const {
        store: { mooeDoc },
    } = ConverterStor;

    const lines = dxf?.entities.filter((obj: any) => obj.type === "LINE");
    const arc = dxf?.entities.filter((obj: any) => obj.type === "ARC");
    const pallete = dxf?.entities.filter((obj: any) => obj.type === "MTEXT");
    const palletLines = dxf?.entities.filter((obj: any) => obj.layer.includes("Маршрут к поддону"));

    setLines(mooeDoc, lines);

    setArc(mooeDoc, arc, lines.length * 4, pallete.length * 4);

    setPalletes(mooeDoc, pallete, palletLines, lines.length * 4, pallete.length);

    return mooeDoc;

}