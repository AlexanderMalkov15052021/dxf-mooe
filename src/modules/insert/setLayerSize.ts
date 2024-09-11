import { scaleCorrection } from "@/constants";
import { getDistTwoPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setLayerSize = (mooeDoc: MooeDoc, layer: any) => {

    const width = getDistTwoPoints(layer.vertices[0].x, layer.vertices[0].y, layer.vertices[1].x, layer.vertices[1].y);
    const height = getDistTwoPoints(layer.vertices[0].x, layer.vertices[0].y, layer.vertices[3].x, layer.vertices[3].y);

    mooeDoc.mSceneMap.mGridMsg.info.width = Math.floor(width * scaleCorrection);
    mooeDoc.mSceneMap.mGridMsg.info.height = Math.floor(height * scaleCorrection);

}