import { createContext,useState } from "react";
export const UserContext=createContext();
export const UserProvider = ({children})=>
{
    const [profile, setProfile] = useState({
        name:"",
        email:"",
    });

    const updateProfile=(newdata)=>{
        setProfile((prev)=>({...prev, ...newdata}));
    };

    return(
        <UserContext.Provider value={{profile,updateProfile}}>
            {children};
        </UserContext.Provider>
    );
};
