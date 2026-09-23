import { useEffect } from "react";
function Home()
{
    useEffect(()=>{
        console.log("Home loaded")
    },[]);

    return(
        <div>
            <h1>Welcome Home</h1>
            <p>This page demonstrates useEffect running once on mount.</p>
        </div>
    );
}
export default Home;