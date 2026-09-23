import { useRef } from "react";
function FocusInput()
{
    const inputRef = useRef();

   const handleFocus=()=>
    {
       inputRef.current.focus();
    };

    return(
        <div className="demo-block">
            <h2>useRef example</h2>
            <input ref={inputRef} placeholder="Enter Name"></input>
            <button onClick={handleFocus}>Focus</button>
        </div>
    );
};

export default FocusInput;