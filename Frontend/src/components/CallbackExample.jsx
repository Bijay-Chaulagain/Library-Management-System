import { useCallback, useState } from "react";

const child = React.memo(({onClick})=>{
    console.log("Child renders");
    return <button onClick={onClick}>Child button</button>
})

function CallbackExample()
{
    const[count,setCount]=useState(0);

    const handleClick = useCallback(()=>
    {
        alert("clicked")
    },[]);

    return(
        <div className="callback-demo">
            <h2>CallbackExample</h2>
            <h2>{count}</h2>
            <button onClick={()=>setCount(count+1)}>count</button>
            <child onClick={handleClick}></child>
        </div>
    );
};

export default CallbackExample;