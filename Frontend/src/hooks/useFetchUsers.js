import { useState, useEffect } from "react";
function useFetchUsers(){
    const[users,setUsers]=useState([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);

    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((res)=>res.json())
        .then((data)=>{
            setUsers(data);
            setLoading(false);
        })
        .catch((err)=>
        {
            setError(err);
            setLoading(false);
        });
    },[]);

    return{users,loading,error};
}

export default useFetchUsers;

