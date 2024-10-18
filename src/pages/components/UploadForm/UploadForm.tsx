import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useRef } from "react";

import DxfParser from 'dxf-parser';
import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { getMooe } from "@/modules/modify/getMooe";

import Worker from "worker-loader!@/workers/worker.ts";

const UploadForm = observer(() => {

    const {
        store: {
            mooeDoc, permission, isLoading, refFileName,
            setIsMessageShow, setIsLoading, setLoadingTime, setRefFileName, setMooeDoc
        },
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

            try {

                if (globalThis.window && globalThis.Worker) {

                    console.time("Converting files");

                    const worker = new Worker();

                    worker.postMessage({
                        dxfStr: JSON.parse(JSON.stringify(fileStr)),
                        mooeDoc: JSON.parse(JSON.stringify(mooeDoc)),
                        permission: JSON.parse(JSON.stringify(permission))
                    });

                    worker.onmessage = evt => {

                        setMooeDoc(JSON.parse(JSON.stringify(evt.data.doc)));

                        setIsLoading(false);

                        clearInterval(interval);

                        console.timeEnd("Converting files");
                    };

                }
                else {
                    console.time("Converting files");

                    console.log("Web worker не поддерживается браузером!");


                    const parser = new DxfParser();

                    const dxf = parser.parse(fileStr);

                    console.log("dxf: ", dxf);

                    const doc = dxf ? getMooe(dxf, mooeDoc, permission) : emptyMooe;

                    setMooeDoc(doc);

                    setIsLoading(false);

                    clearInterval(interval);

                    console.timeEnd("Converting files");
                }

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
        setMooeDoc(emptyMooe);
        refTime.current[0] = 0
        refTime.current[1] = 0
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