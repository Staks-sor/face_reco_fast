const path=require("path");
const http=require("http");
const express=require('express');
const socketio=require('socket.io');



const app=express();
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//     next();
//   });
const server=http.createServer(app);
const io=socketio(server, {allowEIO3: true});
// app.use(require('cors')())

const port=process.env.PORT || 5000;
const publicDirectoryPath=path.join(__dirname,"/public");

app.use(express.static(publicDirectoryPath));


io.on("connection",(client)=>{
    console.log('New websocket connection');
    client.on('messageFromClient', msg => {
        console.log(msg)
        io.emit('messageFromServer', msg);
    });
    client.on('disconnect', () => {
        console.log('New websocket disconnected');
    });
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`);
})