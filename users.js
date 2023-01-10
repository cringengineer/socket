let users = [];


const findUser = (user) => {
    return users.find(item => item.name === user.name && item.room === user.room);
}
const addUser = (user) => {
    const isExist = findUser(user);

    !isExist && users.push(user);

    const currentUser = isExist || user;

    return { isExist: !!isExist, user: currentUser };
};

const getRoom = (room) => users.filter((u) => u.room === room);

const removeUser = (user) => {
    const found = findUser(user);
    if (found) {
        users = users.filter(
            ({ room, name }) => room === found.room && name !== found.name
        );
    }
    return found;
};
module.exports = {addUser, findUser, getRoom, removeUser}