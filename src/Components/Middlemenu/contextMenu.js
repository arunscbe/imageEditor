import { useEditorStore } from "../../store";
import { shallow } from "zustand/shallow";
import { useEffect, useRef, useState } from "react";
import Button from "../Leftmenu/Button";
import { ImImage} from "react-icons/im";

export const ContextMenu = () => {
    const [showContextMenu] = useEditorStore((state) => [state.showContextMenu],shallow);
    let activeObj = useEditorStore.getState().activeSelection;
    let canvas = useEditorStore.getState().fabricCanvas;
    // const [flipX , setFlipX] = useState();
    const flipX = () => {       
        activeObj.set({
            flipX:!activeObj.flipX,
        }); 
        useEditorStore.getState().updateModifaction(true);
       canvas.renderAll();
    }
    const flipY = () => {       
        activeObj.set({
            flipY:!activeObj.flipY,
        }); 
        useEditorStore.getState().updateModifaction(true);
        // activeObj.
        canvas.renderAll();
    }
    const sendBackwards = () => {      
        canvas.sendBackwards(activeObj);
        useEditorStore.getState().updateModifaction(true);
    }
    const bringForward = () => {     
        canvas.bringForward(activeObj);
        useEditorStore.getState().updateModifaction(true);
    }
    const sendToBack = ()=>{
         canvas.sendToBack(activeObj);
         useEditorStore.getState().updateModifaction(true);
    }
    const bringToFront = ()=>{
        canvas.bringToFront(activeObj);
        useEditorStore.getState().updateModifaction(true);
   }
   const snapToCenter = () => {
        activeObj.set({
            left:canvas.width/2,
            originX: 'center',
        });
        useEditorStore.getState().updateModifaction(true);
        canvas.renderAll();
   }
  return (
    <div style={{
        position: "absolute",
        zIndex:1,
        display: showContextMenu && useEditorStore.getState().activeSelection?'block':'none',
        backgroundColor: "white",
        padding: "10px",
      }}
    //   ref = {contextMenuRef}
      onBlur={()=>{
        useEditorStore.setState({showContextMenu:false});
      }}
    >
      <div className="flex flex-col gap-2">
      <Button label="Copy/paste" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={()=>{useEditorStore.getState().duplicateObject(useEditorStore.getState().activeSelection)}}/>
      <Button label="Bring to front" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={bringForward}/>
      <Button label="Send to back" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={sendBackwards}/>
      <Button label="Bring above objects" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={bringToFront}/>
      <Button label="Send under objects" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={sendToBack}/>
      <Button label="Filp horizontally" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={flipX}/>
      <Button label="Flip vertical" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={flipY}/>
      <Button label="Snap to center" className="flex bg-yellow-200 gap-1 text-sm pt-1 pb-1 p-0 m-0" icons={<ImImage/>} onClick={snapToCenter}/>
      </div>
    </div>
  );
};
