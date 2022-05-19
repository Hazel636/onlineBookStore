const chatusers = [];

function userJoin(id,username,room){
    const user = {id, username,room};
    chatusers.push(user);
    return user;
}

module.exports = {
    userJoin
};