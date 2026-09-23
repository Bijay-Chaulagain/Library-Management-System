import { useState } from "react";
function Counter()
{
    const [count,setCount]= useState(0);
    return(
        <div className="block-demo">
            <p>useState example</p>
            <P>{count}</P>
            <button onClick={()=>setCount(count+1)}>Increment</button>
        </div>
    );  
}
export default Counter;