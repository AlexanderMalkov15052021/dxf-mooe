import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent } from "react";

import { emptyMooe } from "@/helpers/emptyMooe/emptyMooe";

import { Modal } from "antd/lib";

const UploadForm = observer(() => {

    const {
        store: {
            isLoading, refFileName, isFarPointsModalOpen, diapasonPoints,
            setIsMessageShow, setIsLoading, setLoadingTime, setRefFileName, setMooeDoc,
            setOpenFarPointsModal, setDXFStr, setRefTime
        },
    } = ConverterStor;

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

            setDXFStr(reader.result as string);

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
        setRefTime([0, 0]);
    }

    const handleOk = () => {
        setOpenFarPointsModal(false);
    }

    const handleCancel = () => {
        setOpenFarPointsModal(false);
    }

    return <>
        <form onClick={isLoading ? evt => evt.preventDefault() : restFiles}>
            <label htmlFor="file-upload" className={isLoading ? "disabledUpload custom-file-upload" : "custom-file-upload"}>
                {refFileName ? refFileName : "Выберите файл .dxf"}
            </label>
            <input id="file-upload" type="file" onChange={isLoading ? evt => evt.preventDefault() : readFile} />
        </form>
        <Modal title="Координаты точек с погрешностью" open={isFarPointsModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {diapasonPoints.map((poin, index: number) =>
                <div key={index}>
                    <span>x: </span><span>{poin.x}</span>
                    <span>y: </span><span>{poin.y}</span>
                </div>
            )}
        </Modal>
    </>
});

export default UploadForm;