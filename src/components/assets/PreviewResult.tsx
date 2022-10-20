import ListOfAssetsToSend from "./ListOfAssetsToSend";

const PreviewResult = (props:any) =>{
    return (
        <div>
            <ListOfAssetsToSend/>
            <button onClick={props.showNext}>Prev</button>
            <button onClick={props.showNext}>Send</button>
        </div>
    )
}
export default PreviewResult;