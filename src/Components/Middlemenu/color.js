import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';


const ColorImpl = props => {
  const [displayPallet, setdisplayPallet] = useState(false);
  const [color, setColor] = useState({ hex: props.color });


  const onChangeComplete = color => {
    setColor(color);
    props.handleChange(props.property, color.hex);
  };
  return (
    <>
      <div className="relative">
        <div className="grid md:grid-cols-2 items-center">         
          <div className="flex gap-1 items-center flex-1 justify-start flex-initial">
            <div
              className="border rounded border-gray-600 h-6 w-6"
              style={{ background: color.hex || '#' + props.color }}
              onClick={() => {
                setdisplayPallet(prev => !prev);
              }}
              onBlur={() => setdisplayPallet(false)}
            ></div>
          </div>
        </div>
        {displayPallet && (
          <div
            className="absolute"
            style={{ left: '5vw', zIndex: '10' }}
            tabIndex={0}
            onBlur={() => setdisplayPallet(false)}
          >
            <ChromePicker
              color={color.hex}
              onChangeComplete={onChangeComplete}
              onChange={onChangeComplete}
              disableAlpha={true}
            />
            <hr />
          </div>
        )}
      </div>
    </>
  );
};



export default ColorImpl;
