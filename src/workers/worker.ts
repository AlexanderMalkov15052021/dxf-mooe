import { emptyMooe } from '@/helpers/emptyMooe/emptyMooe';
import { getMooe } from '@/modules/modify/getMooe';
import DxfParser from 'dxf-parser';

const ctx: Worker = self as any;

const sendDXF = (evt: any) => {

    const parser = new DxfParser();

    const dxf = parser.parse(evt.data.result);

    console.log("dxf: ", dxf);

    const doc = dxf ? getMooe(dxf) : emptyMooe;

    ctx.postMessage({ doc: JSON.parse(JSON.stringify(doc)) });
}

ctx.addEventListener("message", sendDXF);