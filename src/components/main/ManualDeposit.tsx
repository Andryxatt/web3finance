import { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../../Web3DataContext';
import ExampleManual from './ExampleManual';
import Modal from '../ui/Modal';
import React from 'react';
function ManualDeposit(props: any){
    const {
        addressesFromFile,
        setAddressesFromFile
     } = Web3State();

    const [isValid, setIsValid] = useState<boolean>(true);
    const [modalShown, toggleModal] = React.useState(false);
    const [arrayOfAddrAmounts, setArrayOfAddrAmounts] = useState<object[]>([]);
    const [element, setElement] = useState<string>();
    const onChange = useCallback((value: any, viewUpdate: any) => {
        localStorage.setItem("filteredLang", value);
        setElement(value);

    }, []);
    const getListFromFile = () =>{
        let newArr = [];
        let newElems = "";
        if(addressesFromFile.length > 0){
            for (let index = 0; index < addressesFromFile.length; index++) {
                if (index === addressesFromFile.length - 1) {
                    newElems += addressesFromFile[index][0] + "," + addressesFromFile[index][1];
                }
                else {
                    newElems += addressesFromFile[index][0] + "," + addressesFromFile[index][1] + "\n";
                }
                const newElement = {
                    address: addressesFromFile[index][0],
                    amount: addressesFromFile[index][1],
                    errorAddress: !ethers.utils.isAddress(addressesFromFile[index][0]) ? "is not valid" : "",
                    errorAmount: isNaN(addressesFromFile[index][1]) === true ? "is not valid" : "",
                    row: index + 1
                }
                newArr.push(newElement);
            }
            localStorage.setItem("filteredLang", newElems);
            setArrayOfAddrAmounts(newArr);
            setElement(newElems);
            setAddressesFromFile([]);
        }
        
        // deleteInvalidLines();
    }
    const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
    const { setContainer, view, state } = useCodeMirror({
        container: editor.current,
        extensions: [javascript({ jsx: true })],
        value: element,
        height: "200px",
        placeholder: "Enter your deposit address and amount",
        onChange: onChange,
    });
    const deleteInvalidLines = () => {
        let newElems:string;
        const newArray = arrayOfAddrAmounts.filter((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {
                return element
            }
        })
        console.log(newArray, "newArray")
        newArray.forEach((element: any, index: number) => {
            console.log(index, newArray.length)
            if (index === newArray.length - 1) {
                newElems += element.address + "," + element.amount;
            }
            else {
                newElems += element.address + "," + element.amount + "\n";
            }
        })
        setElement(newElems)
        validateinputs()
    }
    const showExample = ()=>{
        console.log("show example")
        const example = [
            {
                'address':'0xa0Ee7A142d267C1f36714E4a8F75612F20a79720','amount':'0.001'
            },
            {
                'address':'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266','amount':'1.01'
            },
            {
                'address':'0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102','amount':'0.2'
            },
        ]
        let newElems = "";
        example.forEach((element: any, index: number) => {
            if (index === example.length - 1) {
                newElems += element.address + "," + element.amount;
            }
            else {
                newElems += element.address + "," + element.amount + "\n";
            }
        })
        setElement(newElems)
    }

    const validateinputs = async () => {
        const arrayOfElements = element!.split("\n")[0] === "" ? [] : element!.split("\n");
        console.log(arrayOfElements, "arrayOfElements")
        const arrayOfElementsWithoutEmpty: { address: string; amount: number; errorAddress: string; errorAmount: string; }[] = [];
       if(arrayOfElements.length > 0){
        arrayOfElements.forEach(async (element: any, index: number) => {
            const newElement = {
                address: element.split(",")[0],
                amount: element.split(",")[1],
                errorAddress: !ethers.utils.isAddress(element.split(",")[0]) ? "is not valid" : "",
                errorAmount: isNaN(element.split(",")[1]) === true ? "is not valid" : "",
                row: index + 1
            }
            arrayOfElementsWithoutEmpty.push(newElement);
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
        setArrayOfAddrAmounts(arrayOfElementsWithoutEmpty);
       }
       else {
        setIsValid(true);
        setArrayOfAddrAmounts([]);
       }
    }
    useEffect(() => {
        getListFromFile();
        localStorage.getItem("filteredLang") !== "" ? setElement(localStorage.getItem("filteredLang") || "") : setElement("");
        if (editor.current) {
            setContainer(editor.current);
            localStorage.getItem("filteredLang") !== null ? setElement(localStorage.getItem("filteredLang") || "") : setElement("");
        }
        if (element !== "" && element !== undefined) {
            validateinputs()
        }
    }, [element, addressesFromFile])
    return (
        <div className="px-5 py-5">
            <div className="flex justify-between items-center mb-2">
                <h3>Addresses with Amounts</h3> <span onClick={() => { props.switchDepoist(false) }} className="underline  cursor-pointer">Upload file</span>
            </div>
            <div>
                <div id="listAddress" className="flex flex-row bg-white overflow-auto ">
                    <div className='w-full' ref={editor}></div>
                </div>
            </div>
            <div className="mt-2 flex flex-row justify-between"><span>Separated by comma</span>
                <button className="underline cursor-pointer" onClick={() => { toggleModal(!modalShown);showExample(); }}>Show examples</button>
               
             
            </div>
            <Modal shown={modalShown} close={() => { toggleModal(false);  }}>
                    <ExampleManual close={() => { toggleModal(false) }}/>
            </Modal>
            <div className={ isValid === true ? "hidden" : ""}>
                <div className="flex flex-row justify-between">
                    <span className="text-red-500">The below addresses cannot be processed</span>
                    <button onClick={deleteInvalidLines} className="underline text-red-500">Delete them</button>
                </div>
                <div className="border-2 px-3 py-3 border-red-500 w-full min-h-[50px] bg-white rounded-md">
                    {
                        arrayOfAddrAmounts?.map((element: any, index: number) => {
                            return (
                                (element.errorAddress !== "" || element.errorAmount !== "") ? <div className="text-red-500" key={index}>
                                    Line {element.row} address or amount is not valid
                                </div> : ""
                            )
                        })
                    }
                </div>
            </div>
            <button onClick={() => {    
                if(arrayOfAddrAmounts.length > 0){
                    props.changeModalContent(isValid, arrayOfAddrAmounts);
                }    
                        
            }} className={`text-white font-bold py-2 px-4 rounded-full ${arrayOfAddrAmounts.length <= 0 ? "bg-red-500" : "bg-slate-500"}  `}>Next</button>
        </div>
    );
}
export default ManualDeposit;