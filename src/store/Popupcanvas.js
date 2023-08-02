
import { fabric } from "fabric";
import { useEditorStore } from ".";
export const Initpopup = () => {
  
  
  const onObjectSelected = (e) =>{   
    // if(e?.selected?.[0]?.colorFill){   
    //   useEditorStore.setState({colorFill : e.selected[0].colorFill})
    // }
    // useEditorStore.setState({currentSelection : popupcanvas.getActiveObject().get('type')})
    // useEditorStore.setState({activeSelection : popupcanvas.getActiveObject()});
    // let _C = e.selected[0].getObjects();
    popupcanvas.getActiveObject().toActiveSelection();
    // console.log(popupcanvas.getActiveObject().toActiveSelection());
    // console.log(e.selected[0].getObjects());
  //   _C.forEach(image => {
  //     var group = e.target;
  //     if (group && group._objects) {
  //         var thisImage = group._objects.indexOf(image);
  //         var item = group._objects[thisImage];//.find(image);
  //         popupcanvas.setActiveObject(item);
  //     }
  // });
    // if(e?.selected?.[0]?.colorFill){   
    //   useEditorStore.setState({colorFill : e.selected[0].colorFill})
    // }
    // useEditorStore.setState({currentSelection : popupcanvas.getActiveObject().get('type')})
    // useEditorStore.setState({activeSelection : popupcanvas.getActiveObject()});
}
  
    const popupcanvas = new fabric.Canvas("popupCanvas", {
        centeredScaling: true,
        preserveObjectStacking: true,
        height: 384,
        width: 384,
        backgroundColor: "#ffff00",
        defaultCursor:'pointer',
        hoverCursor:'pointer',
      });
      popupcanvas.on('selection:created', onObjectSelected);
      return popupcanvas;
}