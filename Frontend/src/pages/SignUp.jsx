import { useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp(){
    const[username,setUsername]=useState("");
    const{login}=useContext(AuthContext);
    const navigate=useNavigate();

    const submit=(e)=>{
        e.preventDefault();
        if(!username.trim()) return;
        login(username);
        navigate("/dashboard");
    }

    return(
        <form onSubmit={submit}>
            <h2>SignUp</h2>
            <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="choose a username"    
            />

            <button type="submit">Signup</button>
        </form>
    )
    
}

export default SignUp;