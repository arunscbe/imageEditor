import { BiUpload ,BiColor} from "react-icons/bi";
import { ImImage} from "react-icons/im";
import { MdOutlineTextFields} from "react-icons/md";
import { useEditorStore } from "../../store";
import { fabric } from "fabric";
import Button from "./Button";
import ColorImpl from "../Middlemenu/color";
import { shallow } from "zustand/shallow";
import ImageTracer from "imagetracerjs";
import { optionpresets } from "../../data";
import { useState } from "react";
// import deleteIcon from '../icons/delete.png'

const Leftmenu = () => {   
  const [canvas,popupCanvas] = useEditorStore((state) => [state.fabricCanvas,state.popupCanv],shallow);
  const [fillColor , setFillColor] = useState([]);
  // const [prevColor ,setPrevColor] = useState('');

  const addText = () => {   
    var text = new fabric.Text("NEW TEXT", {
      fill: "#fff",
      fontFamily:'Arial',
      fontWeight: 'bold',
      top:canvas.height/2-40,
      left:canvas.width/2-205,
      stroke: '#eb4034',
      strokeWidth: 0,
      paintFirst: "stroke",
      charSpacing: 0,
      padding:-1,
      fontSize: 80,
      name:'text',
      charSpacing:-10
    });    
    canvas.add(text);    
    canvas.setActiveObject(text);  
    useEditorStore.setState({currentSelection:'text'}); 
    useEditorStore.getState().deleteButtonControls(text);
    text.setControlsVisibility(useEditorStore.getState().HideControls);
    useEditorStore.getState().nameCounter++;
    useEditorStore.getState().updateModifaction(true);
    useEditorStore.getState().forStoringAllObject(text);//for pushing the data into array for layers
    // useEditorStore.setState({storeAllObject : });
  }
  const handleChange = (property , color) => {
      canvas[property] = color;
      useEditorStore.getState().updateModifaction(true);
      canvas.renderAll();
  }
  
  const svgConverter = (data) => {
    // UN COMMENT IT FOR POPUP CANVAS
    useEditorStore.setState({uploadImageModalDisplay:true}) 
     const ext = data.name.substring(data.name.lastIndexOf('.') + 1);
    let objectURL = URL.createObjectURL(data);
   /* if(ext === 'svg'){
      // let serializer = new XMLSerializer();
      // let svgOne = new XMLSerializer().serializeToString(data);
      
      fabric.loadSVGFromString(data,function(objects, options){

        let obj = fabric.util.groupSVGElements(objects, options);
        console.log('SVG-IMAGE--->',obj);
        // var img1 = img.set({ left: 0, top: 0});
        obj.scaleToHeight(200);
        obj.scaleToWidth(200);
        canvas.add(obj); 
        canvas.centerObject(obj);
       })
    }else{ */   
    ImageTracer.imageToSVG(
      objectURL ,/* input filename / URL */
      function (svgstr) {
        fabric.loadSVGFromString(
          new String(svgstr),
          function (objects, options) {            
          //  console.log(objects);
         /*  objects.forEach(element => {
            popupCanvas.add(element).renderAll();
           });*/
          //  var loadedObject = new fabric.Group(objects);
          //  console.log('-oooooooo',loadedObject);

            let loadedObject = fabric.util.groupSVGElements(objects, options);   
            console.log(loadedObject); 
            // loadedObject.scaleToHeight(300);
            // loadedObject.scaleToWidth(300);
          //  console.log('--->HELLOOO...');
            let objImage = loadedObject._objects;    
            let _Fills = [];
            objImage.forEach((ele)=>{
              ele.set({strokeWidth:0})
              setFillColor([...ele.fill]);
              let _C = RGBToHex(ele.fill);
             _Fills.push(_C);
            })
            setFillColor( removeDuplicates(_Fills));
            _Fills = removeDuplicates(_Fills);
            console.log(_Fills);
            const fillColors = {};
            _Fills.map((item,index)=>{
              fillColors['layer'+index]=item;
            })
            useEditorStore.setState({colorFill:fillColors})     
            //FOR POPUP CANVAS       
            loadedObject.set({
              colorFill : fillColors,
              hasControls:false,
              hasBorders : false,
              lockMovementX:true,
              lockMovementY:true,
            
            })
            // for main canvas use this
           /* loadedObject.set({
              colorFill : fillColors,
            
            })*/
            //-------- use CANVAS INSTEAD OF POPCANVAS--------
            popupCanvas.add(loadedObject).renderAll();
            popupCanvas.centerObject(loadedObject);
            popupCanvas.setActiveObject(loadedObject);
            useEditorStore.setState({activeSelection:loadedObject})
          }
        );
       
      },
      // options
      optionpresets.default
    );    
  // }
  };
  const removeDuplicates = (arr)=> {
    return arr.filter((item,index) => arr.indexOf(item) === index);
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

  const changeSVGColor = (property , color) => {
    const fillColor = useEditorStore.getState().colorFill;
    const previousColor = fillColor[property];   
    const SelectedObjet = useEditorStore.getState().activeSelection;

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
  
  return (
    <>
    <div className=" w-2/5 h-full">
      <div className=" h-full w-4/5 mx-auto my-10">
        <h1>EDIT DESIGN</h1>
      </div>
    
      <input type="file" name="myImage" onChange={(event) => {svgConverter(event.target.files[0]);
        }}
      />
      {/* <div className="flex gap-2">
      {Object.keys(useEditorStore.getState().colorFill)?.map((item)=>{
        return(
          <>
          <ColorImpl handleChange={changeSVGColor} property = {item} color={useEditorStore.getState().colorFill[item]} />
          </>
        )
      })
    }
    </div> */}
      <Button label="Add Art" className="flex" icons={<ImImage/>} onClick={()=>{console.log('sdsdsd...');}}/>
      <Button label="Add Text" className="flex" icons={<MdOutlineTextFields/>} onClick={addText}/>
      <Button label="Color Product"  className="flex" icons={<BiColor/>} onClick={()=>{console.log('sdsdsd...');}} >
        <ColorImpl handleChange = {handleChange} property = {'backgroundColor'} name={'backgroundColor'} color='#e8e8e8'/>
        </Button>
     
    </div>
    {/* <Uploadimage/> */}
    </>
  );
};

export default Leftmenu;
