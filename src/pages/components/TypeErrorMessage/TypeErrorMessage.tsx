import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";

const TypeErrorMessage = observer(() => {

    const {
        store: { isMessageShow },
    } = ConverterStor;

    return isMessageShow && <p className={"message"}>Необходим файл с расширением .dxf</p>
});

export default TypeErrorMessage;