let users = [];


const findUser = (user) => {
    return users.find(item => item.name === user.name && item.room === user.room);
}
const addUser = (user) => {
    const isExist = users.find(item => item.name === user.name && item.room === user.room);
    !isExist && users.push(user);
    const currentUser = isExist || user;
    return {isExist: !!isExist, user: currentUser}
};
const getRoom = (room) => {
    return users.filter(u => u.room === room)
};

const removeUser = (user) => {
    const foundedUser = findUser(user);
    if (foundedUser) {
        users = users.filter(({room, name}) => room === foundedUser.room && name !== foundedUser.name);
    }
    return foundedUser
}

module.exports = {addUser, findUser, getRoom, removeUser}