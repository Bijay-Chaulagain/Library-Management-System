import { useReducer } from "react";
const reducer = (state,action) =>
{
    switch(action.type){
        case "INC":
            return {count:state.count+1};
        
        case "DEC":
            return {count:state.count-1};

        default:
            return state;
    };
};

function ReducerCounter()
{
    const[state,dispatch]=useReducer(reducer,{count:0});
    
    return(
        <div className="reducer-demo">
            <h2>useReducer example</h2>
            <h2>{state.count}</h2>
            <button onClick={()=>dispatch({type:"INC"})}>INC</button>
            <button onClick={()=>dispatch({type:"DEC"})}>DEC</button>
        </div>
    );
};

export default ReducerCounter;
