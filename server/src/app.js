import express from "express"
import cors from "cors"
import http from "http"
import { Server as SocketServer}  from "socket.io"
import pty from "node-pty-prebuilt-multiarch"
import os from "os"
import chokidar from "chokidar"
import fs from "fs/promises"


const app = express()
const server = http.createServer(app)
const io = new SocketServer({
    cors: "*"
})

io.attach(server)

app.use(cors())


app.use(express.urlencoded({extended : true}))
app.use(express.static("public"))

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const   ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "./user", // terminal start on current working directory
  env: process.env
});

chokidar.watch('./user').on('all', (event, path) => {
    console.log(event,path);
    
   io.emit("file:refresh")
  });

ptyProcess.onData(data =>{
    io.emit("terminal:data", data)
}) // after execution in backend ans goes to frontend

io.on("connection" , (socket) => {
    socket.on("terminal:write", (data) => {
        ptyProcess.write(data);
    }) // data comes from frontend

    socket.on("file:change" , async ({path, content}) => {
       await fs.writeFile(`./user/${path}`, content)
    })
})


app.get("/api/file-content", async(req, res) => {
    const {path} = req.query;
    const content = await fs.readFile(`./user/${path}`, "utf-8")
    res.json({content})
})
import router from "./routes/ide.routes.js"


app.use("/api" , router)


export { io, server, app}