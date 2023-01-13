import { javascript } from "@codemirror/lang-javascript";
import { useCodeMirror } from "@uiw/react-codemirror";
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";

const EditorManual = () => {
    // const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
    // const [codeMirrorElement, setCodeMirrorElement] = useState<string>("");
    // const [arrayOfAddressesFromEditor, setArrayOfAddressesFromEditor] = useState<any[]>([]);
    // const [isValid, setIsValid] = useState<boolean>(true);
    // const { setAddressesFromFile } = Web3State();
    // const onChangeMirror = useCallback((value: any, viewUpdate: any) => {
    //     setCodeMirrorElement(value);
    // }, []);
    // const { setContainer } = useCodeMirror({
    //     container: editor.current,
    //     extensions: [javascript({ jsx: true })],
    //     value: codeMirrorElement,
    //     height: "200px",
    //     width: "100%",
    //     placeholder: "Enter your deposit address and amount",
    //     onChange: onChangeMirror,
    // });
    // const showExample = () => {
    //     let exampleAddress = "0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102, 0.1 \n0x4A7Df03838d2A4c9A9B81a3a0099dF500c0Bb102, 0.01 \n0x6538E7d6e90c14FC19045765BB474A6D781c5075, 0.03";
    //     setCodeMirrorElement(exampleAddress)
    // }
    // const validate = useCallback(() => {
    //     const arrayOfElements = codeMirrorElement!.split("\n")[0] === "" ? [] : codeMirrorElement!.split("\n");
    //     const arrayOfElementsWithoutEmpty: { address: string; amount: number; errorAddress: string; errorAmount: string; }[] = [];
    //     const regx = /^\d{1,5}$|(?=^.{1,5}$)^\d+\.\d{0,2}$/;
    //     if (arrayOfElements.length > 0) {
    //         arrayOfElements.forEach(async (element: any, index: number) => {
    //             const newElement = {
    //                 address: element.split(",")[0],
    //                 amount: element.split(",")[1],
    //                 errorAddress: !ethers.utils.isAddress(element.split(",")[0]) ? "is not valid" : "",
    //                 errorAmount: element.split(",")[1] === undefined || !regx.test(element.split(",")[1].trim()) ? "is not valid" : "",
    //                 row: index + 1
    //             }
    //             if (element !== undefined) {
    //                 arrayOfElementsWithoutEmpty.push(newElement);
    //             }
    //         })
    //         let flag = true;
    //         for (let i = 0; i < arrayOfElementsWithoutEmpty.length; i++) {
    //             if (arrayOfElementsWithoutEmpty[i].errorAddress !== "" || arrayOfElementsWithoutEmpty[i].errorAmount !== "") {
    //                 flag = false;
    //                 break;
    //             }
    //             else {
    //                 flag = true;
    //             }
    //         }
    //         setIsValid(flag)
    //         setArrayOfAddressesFromEditor(arrayOfElementsWithoutEmpty);
    //         setAddressesFromFile(arrayOfElementsWithoutEmpty);
    //     }
    // }, [codeMirrorElement, setAddressesFromFile]);
    // const deleteInvalid = useCallback(() => {
    //     let newElems = "";
    //     const validArray = [];
    //     arrayOfAddressesFromEditor.forEach((element: any, index: number) => {
    //         if (element.errorAddress === "" && element.errorAmount === "") {

    //             validArray.push(element);
    //         }

    //     })
    //     validArray.forEach((element: any, index: number) => {
    //         if (index === validArray.length - 1) {
    //             newElems += element.address + "," + element.amount;
    //         }
    //         else {
    //             newElems += element.address + "," + element.amount + "\n";
    //         }
    //     })
    //     setAddressesFromFile(validArray);
    //     setCodeMirrorElement(newElems)
    // }, [arrayOfAddressesFromEditor, setAddressesFromFile])

    // useEffect(() => {
    //     setContainer(editor.current);
    //     validate();
    // }, [codeMirrorElement, setContainer, validate]);
    return (
        <div>
            {/* <div className='w-full rounded' ref={editor}></div>
            <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">The address and amount are separated by commas</span>
                <span onClick={() => showExample()} className="underline cursor-pointer text-gray-500 text-sm">Example files</span>
            </div>
            <div className="mt-1">
                <div className="mb-1">

                    {!isValid && <div className="flex justify-between"> <span className="text-red-600">The below addresses cannot be processed</span> <button className="text-red-600 underline" onClick={() => { deleteInvalid() }}>Delete them</button></div>}
                </div>
                <div className={!isValid ? "flex flex-col rounded-xl bg-white border-2 border-red-400 p-3 mb-1" : "hidden"}>
                    {
                        !isValid && arrayOfAddressesFromEditor.length > 0 && arrayOfAddressesFromEditor.map((element: any, index: number) => {

                            if (element.errorAddress !== "" || element.errorAmount !== "") {
                                return (
                                    <>
                                        {<span key={index} className="text-red-600 text-xs mb-1">Line {element.row} : {element.address} is a invalid wallet address and wrong amount. E.g:address,number</span>}
                                    </>
                                )
                            }
                            else return <></>
                        })
                    }
                </div>
            </div> */}
        </div>
    )
}
export default EditorManual;