import { javascript } from "@codemirror/lang-javascript";
import { createTheme } from '@uiw/codemirror-themes';
import { useCodeMirror } from "@uiw/react-codemirror";
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateAddressesToSend, addressesToSend } from "../../store/multiDeposit/multiDepositSlice";
import { tags as t } from '@lezer/highlight';
const myTheme = createTheme({
    theme: 'light',
    settings: {
      background: '#ffffff',
      foreground: '#4D4D4C',
      caret: '#AEAFAD',
      selection: '#D6D6D6',
      selectionMatch: '#D6D6D6',
      gutterBackground: '#FFFFFF',
      gutterForeground: '#4D4D4C',
      gutterBorder: '#ddd',
      gutterActiveForeground: '',
      lineHighlight: '#EFEFEF',
    },
    styles: [
      { tag: t.comment, color: '#787b80' },
      { tag: t.definition(t.typeName), color: '#194a7b' },
      { tag: t.typeName, color: '#194a7b' },
      { tag: t.tagName, color: '#008a02' },
      { tag: t.variableName, color: '#1a00db' },
    ],
  });
const EditorManual = () => {
    const addressesFromStore = useAppSelector(addressesToSend);
    const dispatch = useAppDispatch();
    const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [codeMirrorElement, setCodeMirrorElement] = useState<string>("");
    const [arrayOfAddressesFromEditor, setArrayOfAddressesFromEditor] = useState<any[]>([]);
    const [isValid, setIsValid] = useState<boolean>(true);
    
    const onChangeMirror = useCallback((value: any, viewUpdate: any) => {
        setCodeMirrorElement(value);
    }, []);
   
    const { setContainer } = useCodeMirror({
        container: editor.current,
        extensions: [javascript({ jsx: true })],
        value: codeMirrorElement,
        height: "200px",
        width: "100%",
        placeholder: "Enter your deposit address and amount",
        onChange: onChangeMirror,
        theme: myTheme
    });
    const showExample = () => {
        let exampleAddress = "0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102, 0.1 \n0x4A7Df03838d2A4c9A9B81a3a0099dF500c0Bb102, 0.01 \n0x6538E7d6e90c14FC19045765BB474A6D781c5075, 0.03";
        setCodeMirrorElement(exampleAddress)
    }
    const validate = useCallback(() => {
        const arrayOfElements = codeMirrorElement!.split("\n")[0] === "" ? [] : codeMirrorElement!.split("\n");
        const arrayOfElementsWithoutEmpty: { address: string; amount: number; errorAddress: string; errorAmount: string; }[] = [];
        const regx = /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/;
        if (arrayOfElements.length > 0) {
            arrayOfElements.forEach(async (element: any, index: number) => {
                const newElement = {
                    address: element.split(",")[0],
                    amount: element.split(",")[1],
                    errorAddress: !ethers.utils.isAddress(element.split(",")[0]) ? "is not valid" : "",
                    errorAmount: element.split(",")[1] === undefined || !regx.test(element.split(",")[1].trim()) ? "is not valid" : "",
                    row: index + 1
                }
                if (element !== undefined) {
                    arrayOfElementsWithoutEmpty.push(newElement);
                }
            })
            let flag = true;
            for (let i = 0; i < arrayOfElementsWithoutEmpty.length; i++) {
                if (arrayOfElementsWithoutEmpty[i].errorAddress !== "" || arrayOfElementsWithoutEmpty[i].errorAmount !== "") {
                    flag = false;
                    break;
                }
                else {
                    flag = true;
                }
            }
            setIsValid(flag)
            setArrayOfAddressesFromEditor(arrayOfElementsWithoutEmpty);
           dispatch(updateAddressesToSend(arrayOfElementsWithoutEmpty));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeMirrorElement]);
    const deleteInvalid = useCallback(() => {
        let newElems = "";
        const validArray = [];
        arrayOfAddressesFromEditor.forEach((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {

                validArray.push(element);
            }
        })
        validArray.forEach((element: any, index: number) => {
            if (index === validArray.length - 1) {
                newElems += element.address + "," + element.amount;
            }
            else {
                newElems += element.address + "," + element.amount + "\n";
            }
        })
        dispatch(updateAddressesToSend(validArray));
        setCodeMirrorElement(newElems)
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrayOfAddressesFromEditor])
    const getFromStore = useCallback(() => {
        let newElems = "";
        addressesFromStore.forEach((element: any, index: number) => {
            if (index === addressesFromStore.length - 1) {
                newElems += element.address + "," + element.amount;
            }
            else {
                newElems += element.address + "," + element.amount + "\n";
            }
        })
        setCodeMirrorElement(newElems)
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [addressesFromStore])
   useEffect(() => {
    if(addressesFromStore.length > 0 ){
        getFromStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
    useEffect(() => {
        setContainer(editor.current);
        validate();
    }, [codeMirrorElement, setContainer, validate]);
    return (
        <div>
            <div className='w-full rounded' ref={editor}></div>
            <div className="flex mt-2 justify-between">
                <span className="text-sm">The address and amount are separated by commas</span>
                <span onClick={() => showExample()} className="underline cursor-pointer pl-1 text-right text-gray-400 hover:text-gray-900 text-sm">Example files</span>
            </div>
            <div>
                <div>
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
            </div>
        </div>
    )
}
export default EditorManual;