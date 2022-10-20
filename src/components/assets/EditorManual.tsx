import { javascript } from "@codemirror/lang-javascript";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import ExampleManual from "../main/ExampleManual";
import Modal from "../ui/Modal";

const EditorManual = () => {
    const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [codeMirrorElement, setCodeMirrorElement] = useState<string>("");

    const onChangeMirror = useCallback((value: any, viewUpdate: any) => {
        localStorage.setItem("filteredLang", value);
        setCodeMirrorElement(value);
    }, []);
    const { setContainer } = useCodeMirror({
        container: editor.current,
        extensions: [javascript({ jsx: true })],
        value: codeMirrorElement,
        height: "200px",
        placeholder: "Enter your deposit address and amount",
        onChange: onChangeMirror,
    });
    const showExample = () =>{
        let exampleAddress = "0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102, 0.1 \n0x4A7Df03838d2A4c9A9B81a3a0099dF500c0Bb102, 0.01 \n0x6538E7d6e90c14FC19045765BB474A6D781c5075, 0.03";
        setCodeMirrorElement(exampleAddress)
    }
    const validateAddresses = () =>{
        let addresses = codeMirrorElement.split("\n");
        let invalidAddresses = [];
        console.log(addresses, "addresses");
        if(addresses.length > 0){
            addresses.forEach((address: any) => {
                if (address.split(",")[0].length !== 42) {
                    invalidAddresses.push(address.split(",")[0]);
                }
                if(address.split(",")[1] === undefined || isNaN(address.split(",")[1])){
                    invalidAddresses.push(address.split(",")[0]);
                }
            });
            if (invalidAddresses.length > 0) {
                alert("Invalid addresses: " + invalidAddresses);
            }
            else {
                alert("All addresses are valid");
            }
        }
       
    }
    useEffect(() => {
        validateAddresses();
        setContainer(editor.current);
    }, [editor.current, codeMirrorElement, setContainer]);
    return (
        <div>
            <div className='w-full rounded' ref={editor}></div>
            <div>
            
            <span>The address and amount are separated by commas</span>
            <span onClick={()=>showExample()} className="underline cursor-pointer">Example files</span>
         
            </div>
           
        </div>
       
        
    )
}
export default EditorManual;