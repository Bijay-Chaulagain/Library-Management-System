import {Link} from "react-router-dom";
function Header()
{
    return(
        <header className="app-header">
            <h1>React learning demo</h1>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/users">Users</Link>
        </header>
    );
}

export default Header;