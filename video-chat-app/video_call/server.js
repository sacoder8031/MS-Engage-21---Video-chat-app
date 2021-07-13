const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);


// importing library uuid for generating random room id
const {v4 : uuidv4} = require('uuid');

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug : true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

roomidList = [];

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});


app.get('/:room' , (req, res) => {
    res.render('room', { roomId: req.params.room})
});


const users = {};


io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        socket.on('message', (message, name) =>{
          io.to(roomId).emit('createMessage',message, name);
        })
        socket.on('disconnect', () => {
           socket.to(roomId).emit('user-disconnected', userId)
        });

    })
})

server.listen(process.env.PORT || 3030);



