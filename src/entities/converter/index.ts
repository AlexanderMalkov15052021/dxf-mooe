import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { FieldType, MooeDoc } from "@/types";
import { makeAutoObservable } from "mobx";

import Worker from "worker-loader!@/workers/worker.ts";
import DxfParser from 'dxf-parser';
import { getMooe } from "@/modules/modify/getMooe";
import { getDxfIdsData } from "@/helpers/get";

class ConverterStor {
    isLoading: boolean = false;
    refFileName: string | null = null;
    loadingTime: number[] = [0, 0];
    isMessageShow: boolean = false;
    href: string = "";
    mooeDoc: MooeDoc = emptyMooe;

    dxfStr: string = "";

    inaccuracy: string = "0.001";
    permission: string = "0.1";

    diapasonPoints: { x: number, y: number }[] = [];

    isFarPointsModalOpen: boolean = false;

    refTime: [number, number] = [0, 0];

    intervalDelay = 1000;

    values: FieldType = {
        rotAngle: "0",
        autocadPointX: "0",
        autocadPointY: "0",
        moeePointX: "0",
        moeePointY: "0",
        inaccuracy: this.inaccuracy,
        permission: this.permission,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setRotAngle = (val: string) => {
        this.values.rotAngle = val;
    }

    setRefTime = (val: [number, number]) => {
        this.refTime = val;
    }

    setDXFStr = (val: string) => {
        this.dxfStr = val;
        this.applyDXFData();
    }

    setOpenFarPointsModal = (val: boolean) => {
        this.isFarPointsModalOpen = val;
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



    applyValues = (values: FieldType) => {



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

        this.isLoading = false;

    }




    setParams = (values: FieldType) => {

        this.values = values;

        console.log(values);

        this.isLoading = true;

        setTimeout(() => this.applyValues(values));

    }

    applyDXFData = () => {
        this.setMooeDoc(emptyMooe);

        try {

            const interval = setInterval(() => {

                if (this.refTime[1] === 59) {
                    this.setLoadingTime([this.refTime[0] + 1, 0]);
                    this.refTime[0] += 1;
                    this.refTime[1] = 0;
                }
                else {
                    this.setLoadingTime([this.refTime[0], this.refTime[1] + 1]);
                    this.refTime[1] += 1;
                }

            }, this.intervalDelay);

            if (globalThis.window && globalThis.Worker) {

                console.time("Converting files");

                const worker = new Worker();

                worker.postMessage({
                    dxfStr: JSON.parse(JSON.stringify(this.dxfStr)),
                    mooeDoc: JSON.parse(JSON.stringify(this.mooeDoc)),
                    permission: JSON.parse(JSON.stringify(this.permission)),
                    inaccuracy: JSON.parse(JSON.stringify(this.inaccuracy))
                });

                worker.onmessage = evt => {

                    const data = JSON.parse(JSON.stringify(evt.data));

                    data.diapasonPoints.length && this.setOpenFarPointsModal(true);

                    this.setMooeDoc(data.mooeDoc);

                    this.applyValues(this.values);

                    this.setDiapasonPoints(data.diapasonPoints);

                    this.setIsLoading(false);

                    clearInterval(interval);

                    console.timeEnd("Converting files");
                };

            }
            else {
                console.time("Converting files");

                console.log("Web worker не поддерживается браузером!");

                const parser = new DxfParser();

                const dxf = parser.parse(this.dxfStr);

                console.log("dxf: ", dxf);

                const dxfIdsData = getDxfIdsData(this.dxfStr);

                const data = dxf
                    ? getMooe(dxf, dxfIdsData, this.mooeDoc, this.permission, this.inaccuracy)
                    : { mooeDoc: emptyMooe, diapasonPoints: [] };

                data.diapasonPoints.length && this.setOpenFarPointsModal(true);

                this.setDiapasonPoints(data.diapasonPoints);

                this.setMooeDoc(data.mooeDoc);

                this.applyValues(this.values);

                this.setIsLoading(false);

                clearInterval(interval);

                console.timeEnd("Converting files");
            }

        } catch (err: any) {
            return console.error(err.stack);
        }
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
