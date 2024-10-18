import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { FieldType, MooeDoc } from "@/types";
import { makeAutoObservable } from "mobx";

class ConverterStor {
    isLoading: boolean = false;
    refFileName: string | null = null;
    loadingTime: number[] = [0, 0];
    isMessageShow: boolean = false;
    href: string = "";
    mooeDoc: MooeDoc = emptyMooe;

    inaccuracy: string = "0.001";
    permission: string = "0.1";

    diapasonPoints: { x: number, y: number }[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setDiapasonPoints = (points: { x: number, y: number }[]) => {
        this.diapasonPoints = points;
    }

    setInaccuracy = (val: string) => {
        this.inaccuracy = val;
    }

    setPermission = (val: string) => {
        this.permission = val;
    }

    setParams = (values: FieldType) => {

        const shiftX = Number(values.moeePointX) - Number(values.autocadPointX);
        const shiftY = Number(values.moeePointY) - Number(values.autocadPointY);

        this.setMooeDoc({
            ...this.mooeDoc,
            mLaneMarks: this.mooeDoc.mLaneMarks.map(obj => ({
                ...obj,
                mLaneMarkXYZW: {
                    ...obj.mLaneMarkXYZW,
                    x: obj.mLaneMarkXYZW.x + shiftX,
                    y: obj.mLaneMarkXYZW.y + shiftY,
                }
            })),

            mRoads: this.mooeDoc.mRoads.map((obj: any) => {

                if (obj.mLanes[0].hasOwnProperty('mBezierControl')) {
                    return {
                        ...obj,

                        mLanes: [
                            {
                                ...obj.mLanes[0],

                                mBezierControl: {
                                    ...obj.mLanes[0]?.mBezierControl,
                                    x: obj.mLanes[0]?.mBezierControl.x + shiftX,
                                    y: obj.mLanes[0]?.mBezierControl.y + shiftY
                                }
                            }
                        ]
                    }
                }

                if (obj.mLanes[0].hasOwnProperty('m_BezierControl1')) {
                    return {
                        ...obj,

                        mLanes: [
                            {
                                ...obj.mLanes[0],

                                m_BezierControl1: {
                                    ...obj.mLanes[0]?.m_BezierControl1,
                                    x: obj.mLanes[0]?.m_BezierControl1.x + shiftX * 50,
                                    y: obj.mLanes[0]?.m_BezierControl1.y + shiftY * 50 * -1
                                },

                                m_BezierControl2: {
                                    ...obj.mLanes[0]?.m_BezierControl2,
                                    x: obj.mLanes[0]?.m_BezierControl2.x + shiftX * 50,
                                    y: obj.mLanes[0]?.m_BezierControl2.y + shiftY * 50 * -1
                                }
                            }
                        ]
                    }
                }

                return { ...obj }

            }),

            mapRotateAngle: Number(values.rotAngle),

        });
    }

    setLoadingTime = (val: number[]) => this.loadingTime = val;
    setIsMessageShow = (val: boolean) => this.isMessageShow = val;
    setRefFileName = (val: string | null) => this.refFileName = val;
    setIsLoading = (val: boolean) => this.isLoading = val;

    setHref = (doc: MooeDoc) => {
        const newDock = JSON.stringify(doc);

        const file = new Blob([newDock as unknown as string], { type: 'application/mooe' });
        const url = URL.createObjectURL(file);

        this.href = url;
    }

    setMooeDoc = (doc: MooeDoc) => {
        this.mooeDoc = doc;
        this.setHref(doc);
    }
}

export const store = new ConverterStor();
