import express from "express";
import SocketIO from "socket.io"

import http from "http";
import { parse } from "path";

const app  = express();
app.set("view engine", "pug");
app.set("views",__dirname + "/views")
app.use("/public",express.static(__dirname + "/public"))
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_,res)=> res.redirect("/"))

const handleListen = () => console.log(`Listening on http:localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer)

wsServer.on("connection",(socket)=>{
    socket.onAny((event)=>{
        console.log(`Socket Event:${event}`);
    })
    //Front에서 실행한 Function을 Server에서 Done으로 실행함
    socket.on("enter_room",(roomName, done)=>{
        socket.join(roomName) //룸
        done();
        socket.to(roomName).emit('welcome');
    });
})





// const wss = new WebSocket.Server({server});

// function onSocketClose() {
//     console.log("Disconnected from the Browser ❌")
// }

// const socekts = [];

// // 웹소켓
// wss.on('connection', (socket)=>{
//     socekts.push(socket);
//     socket["nickname"] = "Anon"
//     console.log("Conneted to Browser✔");
//     socket.on('close',()=> onSocketClose);
//     socket.on('message',(msg)=>{
//         const message = JSON.parse(msg.toString());
//         switch(message.type){
//             case "new_message":
//                 socekts.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     });
//    // socket.send("hello!!!");
// });
httpServer.listen(3000,handleListen)
