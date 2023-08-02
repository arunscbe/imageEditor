import "./App.css";
import { useEffect, useState } from "react";
import Leftmenu from "./Components/Leftmenu/Leftmenu";
import Rightmenu from "./Components/Rightmenu/Rightmenu";
import Middlemenu from "./Components/Middlemenu/Middlemenu";
// import Menu from "./Components/Sidemenu"

function App() {
  return (
    <div className="App w-full mx-auto h-full">
      <div className="headingWrapper  w-full h-10">
        <h1 className="headingText  mx-auto w-36 h-full py-2 text-lg">
          DESIGN EDTIOR
        </h1>
      </div>

      {/* <Menu/> */}
      <div className="Wrapper flex  w-4/5 mx-auto h-full">
        <Leftmenu />
        <div className=" w-full h-full">
          <Middlemenu />
        </div>
          <Rightmenu />
      </div>
    </div>
  );
}

export default App;
