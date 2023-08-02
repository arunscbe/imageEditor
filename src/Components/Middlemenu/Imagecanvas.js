import { useEffect, useState } from "react";
import { useEditorStore } from "../../store";
import { initCanvas } from "../../store/fabricCanvas";
import { ContextMenu } from "./contextMenu";
import { Initpopup } from "../../store/Popupcanvas";
import { shallow } from "zustand/shallow";
import ColorImpl from "../Middlemenu/color";
import { fabric } from "fabric";
const Imagecanvas = () => {
  const [ uploadImageModalDisplay,canvas,popupCanvas,colorFill ] = useEditorStore(state => [state.uploadImageModalDisplay,state.fabricCanvas,state.popupCanv,state.colorFill],shallow)
  const [fillColor , setFillColor] = useState([]);
  useEffect(() => {
    const canv = initCanvas();
    useEditorStore.setState({ fabricCanvas: canv });
    const popupCanv = Initpopup();
    useEditorStore.setState({ popupCanv: popupCanv });

//FOR REMOVING COLOR

    popupCanv.on('mouse:down', function(event) {
      popupCanv.discardActiveObject();
      var mouseClick = popupCanv.getPointer(event.e);
      // console.log('MOUSE-CLICK-->',mouseClick);
      // Iterate through objects on the canvas and check if any intersect with the mouse click
      popupCanv.forEachObject(function(obj) {
        if (obj.type === 'path') {
          if (obj.containsPoint(mouseClick)) {
            popupCanv.remove(obj);
            popupCanv.renderAll();
          }
        }
      });
    });
  }, []);
  
  const popupCanvasCancel = () => {
     useEditorStore.setState({uploadImageModalDisplay : false});
     console.log(popupCanvas.getObjects()[0]);
     popupCanvas.remove(...popupCanvas.getObjects());
  }
  const popupCanvasContinue = () => {
     useEditorStore.setState({uploadImageModalDisplay : false});
     console.log(popupCanvas.getObjects());
    /* const sel = new fabric.ActiveSelection(popupCanvas.getObjects(), {
      popupCanvas: popupCanvas,
    });
    popupCanvas.setActiveObject(sel);
     const _OBJARR = [];
     popupCanvas.getObjects().map((objs)=>{
      _OBJARR.push(objs);
     })
     console.log(_OBJARR);
     const group = new fabric.Group(_OBJARR, {
      left: 100, // Set the position of the group on the canvas (change as needed)
      top: 100,
    });
    console.log('GROUP---->',group);
    canvas.add(group);
    canvas.renderAll();*/
    
     const sel = new fabric.ActiveSelection(popupCanvas.getObjects(), {
      popupCanvas: popupCanvas,
    });
    
    popupCanvas.setActiveObject(sel);
    popupCanvas.requestRenderAll();
    console.log("LENGTH--->",sel.length);
    var object = popupCanvas.getActiveObject();
     console.log('SELECTED OBJECTS-->',object);
     object.clone(function(Img) {      
      Img.set({
        colorFill : useEditorStore.getState().colorFill
      })
      // console.log("---->",useEditorStore.getState().colorFill);
     canvas.add( Img ).renderAll();
     canvas.centerObject(Img);
     canvas.setActiveObject(Img);
     useEditorStore.setState({currentSelection:'group'}); 
     Img.name = 'IMAGE-'+useEditorStore.getState().nameCounter;
     useEditorStore.getState().nameCounter++;
     useEditorStore.getState().forStoringAllObject(Img);
    
   });
    /* popupCanvas.getObjects()[0].clone(function(Img) {
      console.log("---->",Img);
      Img.set({
        colorFill : useEditorStore.getState().colorFill
      })
     canvas.add( Img ).renderAll();
     canvas.centerObject(Img);
     canvas.setActiveObject(Img);
     useEditorStore.setState({currentSelection:'group'}); 
     Img.name = 'IMAGE-'+useEditorStore.getState().nameCounter;
     useEditorStore.getState().nameCounter++;
     useEditorStore.getState().forStoringAllObject(Img);
    
   });*/
    // popupCanvas.remove(...popupCanvas.getObjects());
  }
  //COLOR CHANGE NEED MAKE IT FROM STORE
const changeSVGColor = (property , color) => {
 

  const fillColor = {...useEditorStore.getState().colorFill};
  const previousColor = fillColor[property];   
  const SelectedObjet = useEditorStore.getState().activeSelection;
  // console.log("Color_CHANGING--->",SelectedObjet.colorFill);
  // let _newObj = SelectedObjet.colorFill;
 /* Object.entries(_newObj).forEach(([key, value]) => {
    if(`${value}` === previousColor){
      console.log(`${key}: ${value}` , previousColor);
      _newObj[`${key}`] = color;
    }
    // console.log(`${key}: ${value}`)
});*/
// const sel = new fabric.ActiveSelection(popupCanvas.getObjects(), {
//   popupCanvas: popupCanvas,
// });

// popupCanvas.setActiveObject(sel);
// popupCanvas.requestRenderAll();
 
//  let objImage = SelectedObjet._objects; 

console.log('GETIING ALL OBJECTS--->',popupCanvas.getObjects());
let objImage = popupCanvas.getActiveObject()._objects; 
 /* objImage.forEach((ele)=>{      
    const _C =ele.fill.includes('#')? ele.fill:RGBToHex(ele.fill);    
    if(_C === previousColor){
      ele.set({
        fill: color,
      });
    }
  })  
  popupCanvas.renderAll();
  fillColor[property] = color;
  useEditorStore.setState({colorFill:fillColor});*/
}
const RGBToHex=(rgb)=> {
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  
  rgb = rgb.substr(4).split(")")[0].split(sep);
  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1)r = "0" + r;
  if (g.length == 1)g = "0" + g;
  if (b.length == 1)b = "0" + b;
  return "#" + r + g + b;
}

  return (
    <div className="h-full mx-auto ">
      <ContextMenu />
      <div id="fabCanvas" className="bg-red-400 h-full">
        <canvas id="canvas"></canvas>
      </div>
       
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        style = {uploadImageModalDisplay?{}:{display:"none"}}
      >
    
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Uploaded Image
                    </h3>
                    <div className="mt-2">
                      <canvas id="popupCanvas"></canvas>
                    </div>
                      <div className="flex gap-2">   
                      <button className="bg-red-300" > Remove Colors</button>                    
                        {Object.keys(colorFill)?.map((item)=>{
                            return(
                              <>
                                <ColorImpl handleChange={changeSVGColor} property = {item} color={colorFill[item]} />
                              </>
                            )
                          })
                        }               
                    </div>
                    <div className="flex gap-2">
                       <input type="radio"  name="colors" value="1Col"/>1Col
                       <input type="radio"  name="colors" value="2Col"/>2Col
                       <input type="radio"  name="colors" value="3Col"/>3Col
                       <input type="radio"  name="colors" value="4Col"/>4Col
                       <input type="radio"  name="colors" value="5Col"/>5Col
                       <input type="radio"  name="colors" value="6Col"/>6Col
                       <input type="radio"  name="colors" value="7Col"/>7Col
                       <input type="radio"  name="colors" value="8Col" checked/>8Col
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                  type="button" onClick={popupCanvasContinue}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Continue
                </button>
                <button
                  type="button" onClick={popupCanvasCancel}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  );
};
export default Imagecanvas;
