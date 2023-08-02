import { useEditorStore } from "../../store";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import ColorImpl from "../Middlemenu/color";

const fontPamilies = [
  { name: " ", src: "" },
  { name: "Athletic Block", src: "/fonts/athletic.ttf" },
  { name: "Ballpark", src: "/fonts/ballpark.TTF" },
  { name: "Pro Block", src: "/fonts/pro_block.woff" },
  { name: "Full Block", src: "/fonts/full_block.woff" },
  { name: "Brush Script", src: "/fonts/brush-script-3.ttf" },
  { name: "City Block", src: "/fonts/cityb.woff" },
  { name: "Tiffany", src: "/fonts/tiffany.woff" },
];

const Rightmenu = () => {
  const textSelected = useEditorStore.getState().activeSelection;  
  const canvas = useEditorStore.getState().fabricCanvas; 
  const [currentSelection, activeSelection,colorFill  ] = useEditorStore(
    (state) => [state.currentSelection, state.activeSelection ,state.colorFill],
    shallow
  );
  const [ storeAllObject ] = useEditorStore(state => [state.storeAllObject],shallow)
  const [textInfo, setTextInfo] = useState("");
  const [outlineVal , setOutlineVal] = useState(0.0);
  const [spacingVal , setSpacinglineVal] = useState(1);

  useEffect(() => {
    if (!activeSelection) return;
    setTextInfo(activeSelection.text);
  }, [activeSelection]);

  const onTextChange = (e) => {
    setTextInfo(e.target.value);
    textSelected.set("text", e.target.value);
    canvas.renderAll();
  };
  const fontChange = (e) => {
    // const textSelected = useEditorStore.getState().activeSelection;
    fontPamilies.map((item) => {
      if (item.name == e.target.value) {
        const font = new FontFace(item.name, `url('${item.src}')`);
        font.load().then((value) => {
          document.fonts.add(value);
          document.body.classList.add("fonts-loaded");
          textSelected.set("fontFamily", item.name);
          canvas.renderAll();
        });
      }
    });
  };
const textColorChange=(property , color)=>{  
   textSelected.set('fill',color);
   useEditorStore.getState().updateModifaction(true);
  canvas.renderAll();
}
const nudgeMove =(e) => {
  console.log('iD===>',e.target.id);
  if(e.target.id === 'down'){
    useEditorStore.getState().moveDown(textSelected);
    useEditorStore.getState().updateModifaction(true);
  }else if(e.target.id === 'up'){
    useEditorStore.getState().moveUp(textSelected);
    useEditorStore.getState().updateModifaction(true);
  }else if(e.target.id === 'right'){
    useEditorStore.getState().moveRight(textSelected);
    useEditorStore.getState().updateModifaction(true);
  }else if(e.target.id === 'left'){
    useEditorStore.getState().moveLeft(textSelected);
    useEditorStore.getState().updateModifaction(true);
  }
}
const textOutlineHandler = (e) => {
  if(e.target.id === "plus"){ 
    setOutlineVal(outlineVal + .2);
    textSelected.strokeWidth = outlineVal;
    useEditorStore.getState().updateModifaction(true);
  }else{
    setOutlineVal(outlineVal - .2);
    textSelected.strokeWidth = outlineVal;
    useEditorStore.getState().updateModifaction(true);
  }
  canvas.renderAll();
}
const strokeColorChange = (property,color)=> {
  textSelected.set('stroke',color);
  useEditorStore.getState().updateModifaction(true);
  canvas.renderAll();
}
const textSpacingHandler = (e) => {
  if(e.target.id === "plus"){
    setSpacinglineVal(spacingVal + 10);
    textSelected.charSpacing = spacingVal;
    useEditorStore.getState().updateModifaction(true);
  }else{
    setSpacinglineVal(spacingVal - 10);
    textSelected.charSpacing = spacingVal;
    useEditorStore.getState().updateModifaction(true);
  }
  canvas.renderAll();
}
const boldText=()=>{
  textSelected.set('fontWeight','bold');
  useEditorStore.getState().updateModifaction(true);
  canvas.renderAll();
}
const italicText=()=>{
  textSelected.set('fontWeight','italic');
  useEditorStore.getState().updateModifaction(true);
  canvas.renderAll();
}
const layerHandle = (element,index , num) =>{ 
  const currentObject = [...useEditorStore.getState().storeAllObject];   
  if(num === "minus"){
      canvas.sendToBack(element);  
      useEditorStore.setState({storeAllObject : changeArr(currentObject,index,index + 1) });
  }else{
      canvas.bringToFront(element);
      useEditorStore.setState({storeAllObject : changeArr(currentObject,index,index - 1) });
  }
 
}
const changeArr = (arr,fromIndex , toIndex) => {
  const element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
};
const deleteElement = (item) =>{
      canvas.remove(item);
      canvas.requestRenderAll();
      removeItem(item);
}
const removeItem = (value)=> {
  var index = useEditorStore.getState().storeAllObject.indexOf(value);
  if (index > -1) {
    useEditorStore.getState().storeAllObject.splice(index, 1);
  }
  useEditorStore.setState({storeAllObject : [...useEditorStore.getState().storeAllObject]});
}
//COLOR CHANGE NEED MAKE IT FROM STORE
const changeSVGColor = (property , color) => {
  const fillColor = colorFill;
  const previousColor = fillColor[property];   
  const SelectedObjet = useEditorStore.getState().activeSelection;
  console.log(SelectedObjet);
  let objImage = SelectedObjet._objects; 
  objImage.forEach((ele)=>{      
    const _C =ele.fill.includes('#')? ele.fill:RGBToHex(ele.fill);    
    if(_C === previousColor){
      ele.set({
        fill: color,
      });
    }
  })  
  canvas.renderAll();
  fillColor[property] = color;
  useEditorStore.setState({colorFill:fillColor});
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
useEffect(()=>{
  const unSub = useEditorStore.subscribe((state)=>state.colorFill,(_current,_previous)=>{
    // console.log("_PREVIUS_COLORFIL" , _previous);
    // console.log("_CURRENT_COLOR",_current);
  
  })
  return unSub;
},[])
  return (
    <div className=" w-2/5 h-full">
      {currentSelection === "text" && (
        <div className="">
          <input value={textInfo} onChange={onTextChange} style={{border:'1px solid black'}}></input>
          <div id="textFont">
            <label>Font:</label>
            <select
              name="FontStyleNumber"
              id="FontStyleNumber"
              onChange={fontChange}
            >
              {fontPamilies.map((list) => {
                return (
                  <>
                    <option value={list.name}>{list.name}</option>
                  </>
                );
              })}
            </select>
          </div>
          <br/>
          <ColorImpl handleChange = {textColorChange} property = {'backgroundColor'} name={'backgroundColor'} color={activeSelection.fill}/>
          <button onClick={boldText} >BOLD</button>
          <button onClick={italicText}>Italics</button>
          <h3 className="font-extrabold">Nudge</h3>
          <button onClick={nudgeMove} id='down' className="font-medium text-orange-400">DOWN</button>
          <button onClick={nudgeMove} id='up' className="font-medium text-orange-300 text-lime-400 px-1">UP</button>
          <button onClick={nudgeMove} id='left' className="font-medium text-orange-300 text-teal-500">LEFT</button>
          <button onClick={nudgeMove} id='right' className="font-medium text-orange-300 text-violet-600 px-1">RIGHT</button>
          <br></br>
          <h3>Outline Size</h3>
          <input id='outlineSize' value={outlineVal} size="3"/>
          <button onClick={textOutlineHandler} id="plus" >+</button>
          <button onClick={textOutlineHandler} id="minus">-</button>
          <ColorImpl handleChange = {strokeColorChange} property = {'backgroundColor'} name={'backgroundColor'} color={activeSelection.stroke}/>
          <h3>Spacing</h3>
          <input id='spacing' value={spacingVal} size="3"/>
          <button onClick={textSpacingHandler} id="plus" >+</button>
          <button onClick={textSpacingHandler} id="minus">-</button>
        </div>
      )}
      {currentSelection === "group" && (
        <div className="">
          <h1>FOR Image</h1>
          <div className="flex gap-2">
          {Object.keys(colorFill)?.map((item)=>{
             return(
                
                  <ColorImpl key={item} handleChange={changeSVGColor} property = {item} color={colorFill[item]} />
                 
            )
          })
         }
         </div>
          <h3 className="font-extrabold">Nudge</h3>
          <button onClick={nudgeMove} id='down' className="font-medium text-orange-400">DOWN</button>
          <button onClick={nudgeMove} id='up' className="font-medium text-orange-300 text-lime-400 px-1">UP</button>
          <button onClick={nudgeMove} id='left' className="font-medium text-orange-300 text-teal-500">LEFT</button>
          <button onClick={nudgeMove} id='right' className="font-medium text-orange-300 text-violet-600 px-1">RIGHT</button>
        </div>
      )}
      {currentSelection === "layer" && (
        <div className="">
          <h1>FOR Layer</h1>
          {
            // console.log(storeAllObject);
            storeAllObject.map((item,index)=>{
              return(
                  <div className="innerLayer bg-slate-300 my-1">
                     <h1>{item.text || item.name}</h1>
                     <button className="up mx-1 px-2 border-solid border-2 border-slate-500 " onClick={()=>layerHandle(item,index,"plus")}>UP</button>
                     <button className="down mx-1 px-2 border-solid border-2 border-slate-500" onClick={()=>layerHandle(item,index,"minus")}>DOWN</button>
                     <button className="close mx-1 px-2 border-solid border-2 border-slate-500" onClick={()=>deleteElement(item)}>DELETE</button>
                  </div>
                )
            })
          }
        </div>
      )}
    </div>
  );
};
export default Rightmenu;
