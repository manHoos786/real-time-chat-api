// node server which will handle socket io connections
const express = require('express');
const socketio =require('socket.io');
const http = require('http'); 
const router = require('./router');
const cors = require('cors');

const port = process.env.PORT || 5000;
const host = '0.0.0.0'; 

const app = express();
const server = http.createServer(app);


const io = socketio(server, {

    cors: {

      origin: '*',

    }

  });
  

 
const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message : message, name: users[socket.id]});
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});

app.use(router);
app.use(cors);
server.listen(port, host, ()=>{
    console.log(`Server is running on port ${port}`);
})

// module.exports = {
//     port: port
// };
