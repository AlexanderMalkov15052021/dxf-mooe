import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useRef } from "react";

import DxfParser from 'dxf-parser';
import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { road } from "@/helpers/elements/road";
import { roadPoint } from "@/helpers/elements/roadPoint";
// import { getDistTwoPoints } from "@/helpers/math";

// import Worker from "worker-loader!@/workers/yamlWorker.ts";


const UploadForm = observer(() => {

    const {
        store: { isLoading, refFileName, setIsMessageShow, setIsLoading, setLoadingTime, setRefFileName, setMooeDoc },
    } = ConverterStor;



    const refTime = useRef([0, 0]);




    const readFile = (evt: ChangeEvent<HTMLInputElement>) => {








        if (!evt.target.files) return;

        if (evt.target.files[0].name.split(".").at(-1) !== "dxf") {
            setIsMessageShow(true);
            return
        };

        setIsLoading(true);

        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        setRefFileName(file.name);

        reader.onload = async () => {

            const interval = setInterval(() => {

                if (refTime.current[1] === 59) {
                    setLoadingTime([refTime.current[0] + 1, 0]);
                    refTime.current[0] += 1;
                    refTime.current[1] = 0;
                }
                else {
                    setLoadingTime([refTime.current[0], refTime.current[1] + 1]);
                    refTime.current[1] += 1;
                }

            }, 1000);

            const fileStr = reader.result as string;

            const parser = new DxfParser();

            try {
                const dxf = parser.parse(fileStr);

                // console.log("dxf: ", dxf);

                const dxfFiltered = dxf?.entities.filter((obj: any) => obj.type === "LINE");

                // console.log(dxfFiltered);

                dxfFiltered?.map((obj: any, index: number) => {
                    const pointX1 = obj.vertices[0].x / 10000
                    const pointY1 = obj.vertices[0].y / 10000

                    const pointX2 = obj.vertices[1].x / 10000
                    const pointY2 = obj.vertices[1].y / 10000

                    const startId = 0 + (index * 3);
                    const endId = 1 + (index * 3);
                    const roadId = 2 + (index * 3);

                    // const dist = getDistTwoPoints(pointX1, pointY1, pointX2, pointY2);

                    // if (dist > .1) {
                    (emptyMooe.mLaneMarks as any).push(roadPoint(startId, pointX1, pointY1, Math.PI / 2));
                    (emptyMooe.mLaneMarks as any).push(roadPoint(endId, pointX2, pointY2, Math.PI / 2));

                    (emptyMooe.mRoads as any).push(road(
                        startId,
                        endId,
                        { x: pointX1, y: pointY1, id: startId },
                        { x: pointX2, y: pointY2, id: endId },
                        roadId,
                        Math.PI / 2,
                        0
                    ));
                    // }

                });


                setMooeDoc(JSON.parse(JSON.stringify(emptyMooe)));

                setIsLoading(false);

                clearInterval(interval);


            } catch (err: any) {
                return console.error(err.stack);
            }

        };

        reader.onerror = () => {
            console.error(reader.error);
        };

    }

    const restFiles = (evt: FormEvent<HTMLFormElement>) => {
        setIsMessageShow(false);
        evt.currentTarget.reset();
        setRefFileName(null);
        setLoadingTime([0, 0]);
    }


    return <>
        <form onClick={isLoading ? evt => evt.preventDefault() : restFiles}>
            <label htmlFor="file-upload" className={isLoading ? "disabledUpload custom-file-upload" : "custom-file-upload"}>
                {refFileName ? refFileName : "Выберите файл .dxf"}
            </label>
            <input id="file-upload" type="file" onChange={isLoading ? evt => evt.preventDefault() : readFile} />
        </form>
    </>
});

export default UploadForm;