import { fabric } from "fabric";
// import {historyInit} from 'fabric-history';
import { useEditorStore } from ".";
import deleteIcon from '../delete.png'
import rotateIcon from '../rotate.png'
import settingIcon from '../settings.png'


export const initCanvas = () => {  
    
const onObjectSelected = (e) =>{   
  
    if(e?.selected?.[0]?.colorFill){   
      useEditorStore.setState({colorFill : e.selected[0].colorFill})
    }
    useEditorStore.setState({currentSelection : canv.getActiveObject().get('type')})
    useEditorStore.setState({activeSelection : canv.getActiveObject()});
}
const onObjectDeselected =() => {
  useEditorStore.setState({currentSelection : 'layer'})
}
const onObjectUpdated = () => {

  useEditorStore.setState({currentSelection : canv.getActiveObject().get('type')})

 
  console.log('Current-Slelection--->',useEditorStore.getState().activeSelection);
 
}
  const canv = new fabric.Canvas("canvas", {
    centeredScaling: true,
    preserveObjectStacking: true,
    height: 500,
    width: 500,
    backgroundColor: "#e8e8e8",
  });
  // console.log('HISTORY-->',historyInit());
  let deleteImg = document.createElement('img');
  deleteImg.src = deleteIcon;
  let rotateImg = document.createElement('img');
  rotateImg.src = rotateIcon;
  let settingImg = document.createElement('img');
  settingImg.src = settingIcon;
  fabric.Object.prototype.objectCaching = true;
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "#14caf7";
  fabric.Object.prototype.cornerStrokeColor = "#045791";
  fabric.Object.prototype.borderColor = "#14caf7";
  fabric.Object.prototype.cornerSize = 16;
  // fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.borderDashArray = [5, 5];

  function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size/2, -size/2, size, size);
      ctx.restore();
    }
  }
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.53,
    y: -0.53,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 28
  });
  fabric.Object.prototype.controls.settingControl = new fabric.Control({
    x: -0.53,
    y: -0.53,
    offsetY: -16,
    offsetX: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: function showDiv(eventData, transform) {  
      useEditorStore.setState({showContextMenu:true})
    },
    render: renderIcon(settingImg),
    cornerSize: 28
  });
  function deleteObject(eventData, transform) {
    console.log(transform);
    var target = transform.target;
    var canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
        removeItem(target);
}
const removeItem = (value)=> {
  var index = useEditorStore.getState().storeAllObject.indexOf(value);
  if (index > -1) {
    useEditorStore.getState().storeAllObject.splice(index, 1);
  }
  useEditorStore.setState({storeAllObject : [...useEditorStore.getState().storeAllObject]});
}

  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -40,
    cursorStyle: 'crosshair',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    // mouseover:function hover(eventData,transform){
    //   let target = transform.target;
    //   console.log('TARGET-->',target);
    // },
    render: function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(rotateImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    },
    cornerSize: 28,
    withConnection: true
  });
  
   canv.on('selection:created', onObjectSelected);
   canv.on('selection:cleared', onObjectDeselected)
   canv.on('selection:updated', onObjectUpdated)
  return canv;
};
