import React, { useEffect, useState } from "react";
import ManualDeposit from "./ManualDeposit";
import FilesDeposit from "./FilesDeposit";
import MultiDepoistPreview from "./MultiDepoistPreview";
import Modal from "../ui/Modal";
const fileTypes = ["CSV", "Excel", "Txt"];
function ModalMultiDeposit(props: any) {
    const [modalShown, toggleModal] = React.useState(false);
    const [manualOrFiles, setManualOrFiles] = React.useState(true);

    const switchDepoist = (manualOrFiles: boolean) => {
        setManualOrFiles(manualOrFiles);
    }
    const [nextModal, setNextModal] = useState(false);
    // const [mode, setMode] = React.useState("out-in");
    const [arrayOfAddrAmounts, setArrayOfAddrAmounts] = useState<object[]>([]);
    // const deleteInvalidRows = () => {
    //     const newarr = arrayOfAddrAmounts.map((element: any, index: number) => {
    //         if (element.errorAddress === "" && element.errorAmount === "") {
    //             return element;
    //         }
    //     })
    //     setArrayOfAddrAmounts(newarr);
    // }
    const changeModalContent = (flag: boolean, array: []) => {
        setArrayOfAddrAmounts(array)
        setNextModal(flag);
    }
    useEffect(() => {
    }, [arrayOfAddrAmounts])
    return (
        <>
            <button
                disabled={props.userBalance !== "0" ? false : true}
                onClick={() => { toggleModal(!modalShown); }}
                className={props.userBalance !== "0" ?
                    "mt-2 hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md" : "mt-2 cursor-not-allowed bg-gray-400 text-white font-bold h-[40px] rounded-md"}>
                Multi Deposits
            </button>
            <Modal shown={modalShown} close={() => { toggleModal(false) }}>
                {nextModal ?
                    <MultiDepoistPreview token={props.token} addressesAmount={arrayOfAddrAmounts} changeModalContent={changeModalContent} />
                    :
                    manualOrFiles ? <ManualDeposit changeModalContent={changeModalContent} switchDepoist={switchDepoist} />
                    :
                        <FilesDeposit switchDepoist={switchDepoist} />}

            </Modal>
        </>
    );
}

export default ModalMultiDeposit;
