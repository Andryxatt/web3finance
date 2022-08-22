import { useRef, useState } from "react";
import * as XLSX from "xlsx";

const FilesDeposit = (props: any) => {
    const uploadIcon = require("../../images/upload.png");
    const [file, setFile] = useState<File>();
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
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
        <div className="px-5 py-5">
            <div className="flex justify-between items-center mb-2">
                <h3>Addresses with Amounts</h3><span onClick={() => { props.switchDepoist(true) }} className="underline cursor-pointer">Insert manualy</span>
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
        </div>
    )
}
export default FilesDeposit;

function setDragActive(arg0: boolean) {
    throw new Error("Function not implemented.");
}
