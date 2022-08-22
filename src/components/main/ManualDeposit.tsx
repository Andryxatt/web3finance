import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useEffect, useRef, useState } from 'react';
const ManualDeposit = (props: any) => {
    const [isValid, setIsValid] = useState(true);
    const [arrayOfAddrAmounts, setArrayOfAddrAmounts] = useState<object[]>([]);
    const [element, setElement] = useState<string>();
    const onChange = useCallback((value: any, viewUpdate: any) => {
        localStorage.setItem("filteredLang", value);
        setElement(value);
    }, []);
    const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
    const { setContainer } = useCodeMirror({
        container: editor.current,
        extensions: [javascript({ jsx: true })],
        value: element,
        height: "200px",
        width: "100%",
        placeholder: "Enter your deposit address and amount",
        onChange: onChange,
    });
    const deleteInvalidLines = () => {
        console.log(editor.current);
    }
    const validateinputs = async () => {
        const arrayOfElements = element!.split("\n");
        const arrayOfElementsWithoutEmpty: { address: string; amount: number; errorAddress: string; errorAmount: string; }[] = [];
        let cmlines = document.querySelectorAll(".cm-line");
        arrayOfElements.forEach(async (element: any, index: number) => {
            const newElement = {
                address: element.split(",")[0],
                amount: element.split(",")[1],
                errorAddress: element.split(",")[0].length !== 42 ? "is not valid" : "",
                errorAmount: isNaN(element.split(",")[1]) === true ? "is not valid" : "",
                row: index + 1
            }
            if (newElement.errorAddress !== "" || newElement.errorAmount !== "") {
                cmlines[index].classList.add("cm-line-error");
                setIsValid(false);
            }
            arrayOfElementsWithoutEmpty.push(newElement);
        })
        setArrayOfAddrAmounts(arrayOfElementsWithoutEmpty);
       
       
    }
    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }

        localStorage.getItem("filteredLang") !== null ? setElement(localStorage.getItem("filteredLang") || "") : setElement("");
    }, [])
    return (
        <div className="px-5 py-5">
            <div className="flex justify-between items-center mb-2">
                <h3>Addresses with Amounts</h3> <span onClick={() => { props.switchDepoist(false) }} className="underline  cursor-pointer">Upload file</span>
            </div>
            <div>
                <div id="listAddress" className="flex flex-row bg-white overflow-auto ">
                    {/* <CodeMirror
                        value={element}
                        placeholder="Insert address and amount, separate with comma"
                        height="200px"
                        className="w-full"
                        extensions={[javascript({ jsx: true })]}
                        onChange={onChange}
                    /> */}
                    <div ref={editor}></div>
                </div>
            </div>
            <div className="mt-2 flex flex-row justify-between"><span>Separated by comma</span><span className="underline cursor-pointer">Show examples</span></div>
            <div className={isValid ? "hidden" : ""}>
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
            <button onClick={() => { validateinputs().then(()=>{
                 if(isValid){
            console.log(isValid)
            props.changeModalContent(true);
        }

            }) }} className="text-white font-bold py-2 px-4 rounded-full bg-slate-500">Next</button>
        </div>
    );
}
export default ManualDeposit;