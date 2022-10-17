import React from "react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Web3State } from "../../Web3DataContext";
import Modal from "../ui/Modal";
import ExampleFiles from "./ExampleFiles";

const FilesDeposit = (props: any) => {
    const uploadIcon = require("../../images/upload.png");
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [modalShown, toggleModal] = React.useState(false);
    const {
        setAddressesFromFile
     } = Web3State();
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
        if(e.dataTransfer.files[0].name.split('.')[1] === "xlsx"){
            excelFileRead(e.dataTransfer.files);
        }
        else if(e.dataTransfer.files[0].type === "text/plain" || e.dataTransfer.files[0].name.split('.')[1] === "csv"){
            txtcsvFileRead(e.dataTransfer.files);
        }
    };
    // triggers when file is selected with click
    const handleChange = async (e: any) => {
        e.preventDefault();
        if(e.target.files[0].name.split('.')[1] === "xlsx"){
            excelFileRead(e.target.files);
        }
        else if(e.target.files[0].type === "text/plain" || e.target.files[0].type === "text/csv"){
            txtcsvFileRead(e.target.files);
        }
    };
    const txtcsvFileRead = (filesFromEvent: any) => {
        var files = filesFromEvent, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target!.result?.toString();
            var allTextLines = data!.split(/\r\n|\n/);
            allTextLines.shift();
            allTextLines.pop();
           const res = allTextLines.reduce((acc: any, line: any) => {
                const [address, amount] = line.split(',');
                acc.push([address, amount]);
                return acc;
            },[]);
            if(res.length >= 255){
                alert("Maximum 255 addresses can be added at a time");
            }
            else {
                setAddressesFromFile(res);
                props.switchDepoist(true);
            }
          
        };
        reader.readAsText(f);
    }
    const excelFileRead = (filesFromEvent: any) => {
        var files = filesFromEvent, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target!.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
    
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
            dataParse.shift();
            if(dataParse.length >= 255){
                alert("Maximum 255 addresses can be added at a time");
            }
            else {
                setAddressesFromFile(dataParse);
                props.switchDepoist(true);
            }
        };
        reader.readAsBinaryString(f);
    }
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
                        <button onClick={()=>{onButtonClick()}} className="upload-button">Upload a file</button>
                    </div>
                </label>
                {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </form>
            <div className="mt-2 flex flex-row justify-between"><span>Accepted: CSV / Excel / Txt</span><span onClick={()=>toggleModal(!modalShown)} className="underline cursor-pointer">Example files</span>
            <Modal shown={modalShown} close={() => { toggleModal(false);  }}>
                    <ExampleFiles close={() => { toggleModal(false) }}/>
            </Modal>
           
            </div>
        </div>
    )
}
export default FilesDeposit;

