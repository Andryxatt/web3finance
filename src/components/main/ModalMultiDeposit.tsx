import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import ManualDeposit from "./ManualDeposit";
import FilesDeposit from "./FilesDeposit";
import MultiDepoistPreview from "./MultiDepoistPreview";
function Modal({ children, shown, close }: any) {
    return shown ? (
        <div className="modal-backdrop" onClick={() => { close() }}>
            <div className="modal-content" onClick={e => { e.stopPropagation() }}>
                {children}
            </div>
        </div>
    ) : null;
}
const fileTypes = ["CSV", "Excel", "Txt"];
function ModalMultiDeposit(props: any) {
    const [modalShown, toggleModal] = React.useState(false);
    const [manualOrFiles, setManualOrFiles] = React.useState(true);
    // drag state
    const switchDepoist = (manualOrFiles: boolean) => {
        console.log(manualOrFiles);
        setManualOrFiles(manualOrFiles);
    }
    const [nextModal, setNextModal] = useState(false);
    const [arrayOfAddrAmounts, setArrayOfAddrAmounts] = useState<object[]>([]);
    const deleteInvalidRows = () => {
        const newarr = arrayOfAddrAmounts.map((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {
                return element;
            }
        })
        setArrayOfAddrAmounts(newarr);
    }
    const changeModalContent = (flag:boolean) =>{
        console.log(flag)
        setNextModal(flag);
    }
    useEffect(() => {
    }, [arrayOfAddrAmounts])
    return (
        <>
            <Button
                disabled={props.userBalance !== "0" ? false : true}
                onClick={() => { toggleModal(!modalShown); localStorage.setItem("filteredLang", ""); }}
                className={props.userBalance !== "0" ?
                    "mt-2 hover:bg-gray-600 h-[40px] px-0 py-0 bg-gray-500 text-white font-bold rounded-md normal-case" :
                    "mt-2 cursor-not-allowed h-[40px] px-0 py-0 bg-gray-400 text-white font-bold rounded-md normal-case"}>
                Multi Deposits
            </Button>
            <Modal shown={modalShown} close={() => { toggleModal(false) }}>
                {
                  nextModal ? <MultiDepoistPreview changeModalContent={changeModalContent}/> : 
                  manualOrFiles ? <ManualDeposit changeModalContent={changeModalContent} switchDepoist={()=>switchDepoist}/> : <FilesDeposit switchDepoist={()=>switchDepoist} />
                }

            </Modal>
        </>
    );
}

export default ModalMultiDeposit;
