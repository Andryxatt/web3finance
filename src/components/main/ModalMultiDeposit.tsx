import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import * as XLSX from "xlsx";
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
function ModalMultiDeposit(props:any) {
    const uploadIcon = require("../../images/upload.png");
    const [modalShown, toggleModal] = React.useState(false);
    const [manualOrFiles, setManualOrFiles] = React.useState(true);
    const [file, setFile] = useState<File>();
    const inputRef = React.useRef<HTMLInputElement>(null);
    // drag state
    const [dragActive, setDragActive] = React.useState(false);

    // handle drag events
    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    // triggers when file is dropped
    const handleDrop = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            const data = await file?.arrayBuffer();
            const workBook = XLSX.read(data);
            console.log(workBook);
        }
    };
    // triggers when file is selected with click
    const handleChange = async (e: any) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const data = await file?.arrayBuffer();
            const workBook = XLSX.read(data);
            console.log(workBook);
        }
    };
    const onButtonClick = () => {
        inputRef.current?.click();
    };
    return (
        <>
            <Button 
            disabled={props.userBalance !== "0" ? false : true} 
            onClick={() => {toggleModal(!modalShown)}} 
            className={props.userBalance !== "0" ? "mt-2 hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md normal-case" :"mt-2 cursor-not-allowed bg-gray-400 text-white font-bold h-[40px] rounded-md normal-case"}>Multi Deposits</Button>
            <Modal shown={modalShown} close={() => { toggleModal(false) }}>
                {
                    manualOrFiles ? <div className="px-5 py-5">
                        <div className="flex justify-between items-center mb-2">
                            <h3>Addresses with Amounts</h3><span onClick={() => { setManualOrFiles(!manualOrFiles) }} className="underline cursor-pointer">Insert manualy</span>
                        </div>
                        <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="bg-white hover:bg-slate-200 cursor-pointer rounded-md flex flex-col justify-center items-center h-[250px]">
                            <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
                            <label id="label-file-upload" htmlFor="input-file-upload">
                                <div className="flex flex-col justify-center items-center">
                                    <img className="w-[46px] h-[46px]" src={uploadIcon} alt="upload" />
                                    <p>Drag and drop your file here or</p>
                                    <button onClick={onButtonClick} className="upload-button">Upload a file</button>
                                </div>
                            </label>
                            {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                        </form>
                        <div className="mt-2 flex flex-row justify-between"><span>Accepted: CSV / Excel / Txt</span><span className="underline cursor-pointer">Example files</span></div>
                    </div> :
                        <div className="px-5 py-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3>Addresses with Amounts</h3> <span onClick={() => { setManualOrFiles(!manualOrFiles) }} className="underline  cursor-pointer">Upload file</span>
                            </div>
                            <div>
                                <div></div>
                                <textarea className="bg-white rounded-md flex px-5 py-3 w-full h-[250px]">
                                    1 Insert address and amount, separate with comma
                                </textarea>
                            </div>
                            <div className="mt-2 flex flex-row justify-between"><span>Separated by comma</span><span className="underline cursor-pointer">Show examples</span></div>
                        </div>
                }
            </Modal>
        </>
    );
}

export default ModalMultiDeposit;