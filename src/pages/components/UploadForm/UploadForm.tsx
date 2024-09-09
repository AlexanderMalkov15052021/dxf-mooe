import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useRef } from "react";

import DxfParser from 'dxf-parser';
import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";
import { getMooe } from "@/modules/modify/getMooe";

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

                console.log("dxf: ", dxf);

                const doc = dxf ? getMooe(dxf) : emptyMooe;

                setMooeDoc(JSON.parse(JSON.stringify(doc)));

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
        setMooeDoc(emptyMooe);
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