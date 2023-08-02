import Button from "../Leftmenu/Button";
import Imagecanvas from "./Imagecanvas";
import {MdSelectAll} from "react-icons/md"
import {HiOutlineDuplicate} from "react-icons/hi"
import {MdLayers} from 'react-icons/md'
import {CgUndo,CgRedo} from "react-icons/cg"
import {AiOutlineSave} from 'react-icons/ai'
import { useEditorStore } from "../../store";
import { fabric } from "fabric";
import { shallow } from "zustand/shallow";
import ImageTracer from "imagetracerjs";
import { optionpresets } from "../../data";
import { useEffect } from "react";

const Middlemenu = () => {
  // const canvas = useEditorStore.getState().fabricCanvas;
  const [canvas ] = useEditorStore((state) => [state.fabricCanvas],shallow);
  const selectAllHandler = () => {    
      canvas.discardActiveObject();
      const sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
    useEditorStore.getState().updateModifaction(true);
  }
 
  useEffect(()=>{
    if(!canvas)return;
    window.addEventListener('resize',resizeCanvas)
    canvas.on('object:modified',function(){
      useEditorStore.getState().updateModifaction(true);
      useEditorStore.getState().activeSelection.set({
        hasControls: true
      });
    })
    canvas.on('after:render',function(e){
      // useEditorStore.getState().updateModifaction(true);
    })
    canvas.on('object:scaling',(e)=>{
      const _ele = e.target;
      // console.log(_ele.oCoords);
      if( _ele.getScaledWidth() > (_ele.canvas.width - 140)){
      }
    })

    // FOR OBJECT RESTRICT
  canvas.on('object:moving',function(e){
    const obj = e.target;
    obj.set({
      hasControls: false
    });
    // obj.setControlsVisibility = false;
  //  console.log(obj.setControlsVisibility);
     // if object is too big ignore
    if(obj.getScaledHeight() > obj.canvas.height || obj.getScaledWidth() > obj.canvas.width){
        return;
    }
    obj.setCoords();        
    // top-left  corner
    if(obj.getBoundingRect().top < 10 || obj.getBoundingRect().left < 10){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top + 20);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left + 20) ;
    }
    // bot-right corner
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top - 20) ;
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left - 20);
    }
  }) 
  },[canvas]) 

  const resizeCanvas=()=> {
    const outerCanvasContainer = document.getElementById('fabCanvas');
    
    const ratio = canvas.getWidth() / canvas.getHeight();
    const containerWidth   = outerCanvasContainer.clientWidth;

    const scale = containerWidth / canvas.getWidth();
    const zoom  = canvas.getZoom() * scale;
    canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
}

  const saveHandler = () => {
    console.log('----->',useEditorStore.getState().storeAllObject);
    let canvas = useEditorStore.getState().fabricCanvas;
    let imageBlob = canvas.toSVG();
    // console.log('SVG--->',imageBlob);
    let _U = canvas.toJSON();
    // console.log(_U);
    localStorage.setItem('design', JSON.stringify(_U));
    // console.log('--->',JSON.stringify(_U));
   const element = document.createElement("a");
    const textFile = new Blob([[JSON.stringify(_U)], {type: 'text/plain'}]); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = "userFile.JSON";
    document.body.appendChild(element); 
    element.click();    
  }
  
  const loadFile = (file) => {
    let canvas = useEditorStore.getState().fabricCanvas;
    if (localStorage.getItem("design") !== null) {
      const json = localStorage.getItem("design");    
      canvas.loadFromJSON(JSON.parse(json),function(){
          canvas.renderAll.bind(canvas)
        }
      );
  }
  }
  //layerDisplayHandler
  const layerDisplayHandler= () => {
    useEditorStore.setState({currentSelection:'layer'}); 
  }
  //undo and redo
   const undoHandler = () => {
      useEditorStore.getState().undo('');
   }
   const redoHandler = () => {
    useEditorStore.getState().redo('');
   }
  return (
    <div className="h-full ">
      <div className=" flex h-20 ">
      <Button label="Select All" className='flex-col w-24 gap-2' icons={<MdSelectAll/>} onClick={selectAllHandler}/>
      <Button label="Duplicate" className='flex-col w-24 gap-2' icons={<HiOutlineDuplicate/>} onClick={()=>{useEditorStore.getState().duplicateObject(useEditorStore.getState().activeSelection)}}/>
      {/* <Button label="Layers" className='flex-col w-24 gap-2' icons={<BsLayers/>} onClick={()=>{useEditorStore.setState({currentSelection:'layer'})}}/> */}
      <Button label="Layer" className='flex-col w-24 gap-2' icons={<MdLayers/>} onClick={layerDisplayHandler}/>
      <Button label="Undo" className='flex-col w-24 gap-2' icons={<CgUndo/>} onClick={undoHandler}/>
      <Button label="Redo" className='flex-col w-24 gap-2' icons={<CgRedo/>} onClick={redoHandler}/>
      <Button label="save" className='flex-col w-24 gap-2' icons={<AiOutlineSave/>} onClick={saveHandler}/>
      <input type="file" name="loadJSON" onChange={(event) => {loadFile(event.target.files[0])}}/>
      </div>
      <Imagecanvas />
    </div>
  );
};
export default Middlemenu;
