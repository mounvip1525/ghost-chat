const users =  [];

const addUser = ({ id , name , room })=> {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const userExists = users.find(user=>user.room === room && user.name === name);
    if(userExists){
        return { error: 'Username has already been taken!'};
    }

    const user = { id , name , room }; //id:id,name:name,room:room-shorthand
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex(user=>user.id === id);
    if(index !==-1){
        return users.splice(index,1)[0] //[0] will return the spliced user
    }
}

const getUser = (id) => users.find(user=>user.id===id)

const getUsersInRoom = (room) => users.filter(user=>user.room===room);

module.exports = { addUser , removeUser , getUser , getUsersInRoom }