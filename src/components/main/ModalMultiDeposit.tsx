import React, { useState } from "react";
import ManualDeposit from "./ManualDeposit";
import FilesDeposit from "./FilesDeposit";
import MultiDepoistPreview from "./MultiDepoistPreview";
import Modal from "../ui/Modal";
function ModalMultiDeposit(props: any) {
    const [modalShown, toggleModal] = React.useState(false);
    const [manualOrFiles, setManualOrFiles] = React.useState(true);
    const switchDepoist = (manualOrFiles: boolean) => {
        setManualOrFiles(manualOrFiles);
    }
    const [nextModal, setNextModal] = useState(false);
    const [arrayOfAddrAmounts, setArrayOfAddrAmounts] = useState<object[]>([]);
    const changeModalContent = (flag: boolean, array: []) => {
        setArrayOfAddrAmounts(array)
        setNextModal(flag);
    }
    // console.log(arrayOfAddrAmounts, "arrayOfAddrAmounts");
    // console.log(nextModal, "nextModal");
    // console.log(manualOrFiles, "manualOrFiles");
    
    return (
        <>
            <button
                disabled={props.userTokenBalance !== "0" ? false : true}
                onClick={() => { toggleModal(!modalShown); }}
                className={props.userTokenBalance !== "0" ?
                    "mt-2 hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md" : "mt-2 cursor-not-allowed bg-gray-400 text-white font-bold h-[40px] rounded-md"}>
                Multi Deposits
            </button>
            <Modal shown={modalShown} close={() => { toggleModal(false) }}>
                {nextModal ?
                    <MultiDepoistPreview token={props.token} network={props.network} userTokenBalance={props.userTokenBalance} addressesAmount={arrayOfAddrAmounts} changeModalContent={changeModalContent} />
                    :
                    manualOrFiles ? 
                    <ManualDeposit changeModalContent={changeModalContent} switchDepoist={switchDepoist} /> :
                    <FilesDeposit switchDepoist={switchDepoist} />}

            </Modal>
        </>
    );
}

export default ModalMultiDeposit;
