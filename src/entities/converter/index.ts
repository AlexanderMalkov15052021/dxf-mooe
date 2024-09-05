import { MooeDoc } from "@/types";
import { makeAutoObservable } from "mobx";

class ConverterStor {
    isLoading: boolean = false;
    refFileName: string | null = null;
    loadingTime: number[] = [0, 0];
    isMessageShow: boolean = false;
    href: string = "";
    mooeDoc: MooeDoc = null;

    constructor() {
        makeAutoObservable(this);
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
