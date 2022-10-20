import { useState } from "react";
import EditorFile from "./EditorFile";
import EditorManual from "./EditorManual";
import PreviewResult from "./PreviewResult";
const EditorAddresses = () => {
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const showNext = () =>{
        setIsPreview(!isPreview);
    }
    return (
        <>
        {
            isPreview ? <div>
            <div>
                <span>Addresses with Amounts</span>
                <div className="cursor-pointer" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
            </div>
            {
                isManual ? <EditorManual /> : <EditorFile />
            }
            <button onClick={showNext}>Next</button>
        </div> :
        <PreviewResult showNext={showNext}/>
        }
      
        </>
    )
}
export default EditorAddresses;