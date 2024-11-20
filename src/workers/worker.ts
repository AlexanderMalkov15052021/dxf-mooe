import { emptyMooe } from '@/helpers/emptyMooe/emptyMooe';
import { getDxfIdsList } from '@/helpers/get';
import { getMooe } from '@/modules/modify/getMooe';
import DxfParser from 'dxf-parser';

const ctx: Worker = self as any;

const sendDXF = (evt: any) => {

    const parser = new DxfParser();

    const dxf = parser.parse(evt.data.dxfStr);

    const dxfIdsList = getDxfIdsList(evt.data.dxfStr);

    console.log("dxf: ", dxf);

    const data = dxf
        ? getMooe(dxf, dxfIdsList, evt.data.mooeDoc, evt.data.permission, evt.data.inaccuracy)
        : { mooeDoc: emptyMooe, diapasonPoints: [] };

    ctx.postMessage({
        mooeDoc: JSON.parse(JSON.stringify(data.mooeDoc)),
        diapasonPoints: JSON.parse(JSON.stringify(data.diapasonPoints))
    });
}

ctx.addEventListener("message", sendDXF);