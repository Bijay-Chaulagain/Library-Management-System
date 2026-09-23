function UserCard({name,email})
{
    return(
        <div className="user-block">
           <p><strong>{name}</strong></p>

           <p>{email}</p>
        </div>
    );
};
export default UserCard;