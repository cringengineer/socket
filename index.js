const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const router = require('./route');
const {addUser, findUser, getRoom, removeUser} = require('./users');

app.use(cors({origin: "*"}));
app.use(router);
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    socket.on('join', ({name, room}) => {
        socket.join(room);

        const {user} = addUser({name, room});

        socket.emit('message', {
            data: {user: {name: 'Admin'}, message: `Hello ${name}`}
        });

        socket.broadcast.to(user.room).emit('message', {
            data: {user: {name: 'Admin'}, message: `${user.name} has joined`}
        })

        socket.to(user.room).emit("joinedRoom", {data: {room: user.room, users: getRoom(user.room)}});
    });

    socket.on('sendMessage', ({message, params}) => {
        const user = findUser(params);
        io.to(user.room).emit("message", {data: {user, message}});
    })

    socket.on('leaveRoom', ({params}) => {
        const user = removeUser(params);
        if (user) {
            const { room, name } = user;

            io.to(room).emit("message", {
                data: { user: { name: "Admin" }, message: `${name} has left` },
            });

            io.to(room).emit("room", {
                data: { users: getRoom(room) },
            });
        }
    });

    io.on('disconnect', () => {
        console.log('disconnect')
    });
})


server.listen(5000, () => {
    console.log('Server is working')
});

