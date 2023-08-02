import { useState } from "react";
import {create} from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import deleteIcon from '../icons/delete.svg'

export const editorState = (set, get) => {
  // const [storeHistory , setStoreHistory] = useState([]);
  
  return {
    fabricCanvas: null,
    popupCanv:null,
    uploadImageModalDisplay:false,
    currentSelection : "layer",
    activeSelection : null,
    colorFill : {},
    // colorFillPopup : {},
    storeAllObject : [],
    HideControls :{
      'tl':true,
      'tr':true,
      'bl':true,//false
      'br':true,
      'ml':false,
      'mt':false,
      'mr':false,
      'mb':false,
      'mtr':true,
      // 'cornerColor':'yellow'
  },
  showContextMenu :false,
  forStoringAllObject :function(data){
    get().storeAllObject.unshift(data);//FOR PUSHING THE ARRAY RESERVE
  },
  duplicateObject : function(getObj){
    get().updateModifaction(true);
    getObj.clone(function(o){
      let vObj = o;
      if(vObj){
        vObj.set({
          left: getObj.left + 5,
          top : getObj.top + 5,
        });
        get().fabricCanvas.add(vObj);
        get().fabricCanvas.renderAll();
      }
    });
  },
  deleteButtonControls : function(getObj){
    // console.log(deleteIcon,'SELECTED......',getObj);
  },
  storeHistory : [],
  count : 0,
  nameCounter : 0,
  skipEvent : false, 
  updateModifaction : (saveHistory)=>{   
    if(saveHistory){
      let myjson = JSON.stringify(get().fabricCanvas);
      get().storeHistory.push(myjson);
    }
  },
  undo : ()=>{
    if (get().count < get().storeHistory.length) {
      get().fabricCanvas.clear().renderAll();
      get().fabricCanvas.loadFromJSON(get().storeHistory[get().storeHistory.length - 1 - get().count - 1]);
      get().fabricCanvas.renderAll();
      get().count += 1;
  }
  },
  redo : ()=>{
    if (get().count > 0) {
      get().fabricCanvas.clear().renderAll();
      get().fabricCanvas.loadFromJSON(get().storeHistory[get().storeHistory.length - 1 - get().count + 1]);
      get().fabricCanvas.renderAll();
      get().count -= 1;
  }
  },  
  moveDown : (element)=>{
    element.top = element.top + 2;
    get().fabricCanvas.renderAll();
  },
  moveUp : (element)=>{
    element.top = element.top - 2;
    get().fabricCanvas.renderAll();
  },
  moveRight : (element)=>{
    element.left = element.left + 2;
    get().fabricCanvas.renderAll();
  },
  moveLeft : (element)=>{
    element.left = element.left - 2;
    get().fabricCanvas.renderAll();
  },
  };
};
export const useEditorStore = create(subscribeWithSelector(editorState));

window.database = useEditorStore;
