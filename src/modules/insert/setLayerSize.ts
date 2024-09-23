import { scaleCorrection } from "@/constants";
import { getDistTwoPoints } from "@/helpers/math";
import { MooeDoc } from "@/types";

export const setLayerSize = (mooeDoc: MooeDoc, layer: any) => {

    const width = getDistTwoPoints(layer?.vertices[0].x, layer?.vertices[0].y, layer?.vertices[1].x, layer?.vertices[1].y);
    const height = getDistTwoPoints(layer?.vertices[0].x, layer?.vertices[0].y, layer?.vertices[3].x, layer?.vertices[3].y);

    mooeDoc.mSceneMap.mMapAttr.mMapWidth = width * scaleCorrection;
    mooeDoc.mSceneMap.mMapAttr.mMapLength = height * scaleCorrection;

    mooeDoc.mSceneMap.mGridMsg.info.width = Math.floor(width * scaleCorrection / 0.05);
    mooeDoc.mSceneMap.mGridMsg.info.height = Math.floor(height * scaleCorrection / 0.05);

    mooeDoc.mSceneMap.mMapAttr.mMapOrigin.x = layer?.vertices[1].x * scaleCorrection;
    mooeDoc.mSceneMap.mMapAttr.mMapOrigin.y = layer?.vertices[1].y * scaleCorrection;

    mooeDoc.mSceneMap.mGridMsg.info.origin.position.x = layer?.vertices[1].x * scaleCorrection;
    mooeDoc.mSceneMap.mGridMsg.info.origin.position.y = layer?.vertices[1].y * scaleCorrection;

}