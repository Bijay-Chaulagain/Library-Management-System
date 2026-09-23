import UserCard from "./UserCard";
function UserList({users}){
    if(!users || users.length===0){
        return <p>no users found</p>;
    }

    return(
        <div>
            {users.map((user)=>(
                <UserCard key={user.id} name={user.name} email={user.email}></UserCard>
            ))}
        </div>
    );
};
export default UserList;