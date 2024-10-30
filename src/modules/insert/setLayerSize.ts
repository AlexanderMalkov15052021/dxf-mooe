import { scaleCorrection } from "@/constants";
import { getDistTwoPoints } from "@/helpers/math";
import { Coords, MooeDoc } from "@/types";

export const setLayerSize = (mooeDoc: MooeDoc, layer: any, origin: Coords) => {

    const width = getDistTwoPoints(
        (layer?.vertices[0].x + origin.x),
        (layer?.vertices[0].y + origin.y),
        (layer?.vertices[1].x + origin.x),
        (layer?.vertices[1].y + origin.y)
    );
    const height = getDistTwoPoints(
        (layer?.vertices[0].x + origin.x),
        (layer?.vertices[0].y + origin.y),
        (layer?.vertices[3].x + origin.x),
        (layer?.vertices[3].y + origin.y)
    );

    mooeDoc.mSceneMap.mMapAttr.mMapWidth = width * scaleCorrection;
    mooeDoc.mSceneMap.mMapAttr.mMapLength = height * scaleCorrection;

    mooeDoc.mSceneMap.mGridMsg.info.width = Math.floor(width * scaleCorrection / 0.05);
    mooeDoc.mSceneMap.mGridMsg.info.height = Math.floor(height * scaleCorrection / 0.05);

    mooeDoc.mSceneMap.mMapAttr.mMapOrigin.x = (layer?.vertices[1].x + origin.x) * scaleCorrection;
    mooeDoc.mSceneMap.mMapAttr.mMapOrigin.y = (layer?.vertices[1].y + origin.y) * scaleCorrection;

    mooeDoc.mSceneMap.mGridMsg.info.origin.position.x = (layer?.vertices[1].x + origin.x) * scaleCorrection;
    mooeDoc.mSceneMap.mGridMsg.info.origin.position.y = (layer?.vertices[1].y + origin.y) * scaleCorrection;

}