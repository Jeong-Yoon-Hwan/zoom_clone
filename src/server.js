import express from "express";
import WebSocket from "ws";
import http from "http";

const app  = express();
app.set("view engine", "pug");
app.set("views",__dirname + "/views")
app.use("/public",express.static(__dirname + "/public"))
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_,res)=> res.redirect("/"))

const handleListen = () => console.log(`Listening on http:localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

function onSocketClose() {
    console.log("Disconnected from the Browser ❌")
}

const socekts = [];

wss.on('connection', (socket)=>{
    socekts.push(socket);
    console.log("Conneted to Browser✔");
    socket.on('close',()=> onSocketClose);
    socket.on('message',(message)=>{
        socekts.forEach((aSocket) => aSocket.send(message.toString()));
    });
    socket.send("hello!!!");
});
server.listen(3000)