import express from "express"
import cors from "cors"
import http from "http"
import { Server as SocketServer}  from "socket.io"
import pty from "node-pty-prebuilt-multiarch"
import os from "os"
import chokidar from "chokidar"
import fs from "fs/promises"
import path from "path"

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

const terminals= new Map()

chokidar.watch('./user').on('all', (event, path) => {
    //console.log(event,path);
    
   io.emit("file:refresh")
  });

// ptyProcess.onData(data =>{
//     io.emit("terminal:data", data)
// }) // after execution in backend ans goes to frontend

io.on("connection" , (socket) => {

  const createTerminal = (terminalId) => {
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: path.join(process.env.INIT_CWD, "user"), // Fixed path
      env: process.env
    });

    terminals.set(terminalId, ptyProcess);

    ptyProcess.onData((output) => {
          const id =terminalId
          console.log(id, output);
          
          socket.emit("terminal:data",{id, output})
          //console.log( terminalId,data);
        })
  }
  socket.on("terminal:write", ({ terminalId, data }) => {
     //console.log(terminalId, data);
    const ptyProcess = terminals.get(terminalId);
    if (ptyProcess) {
      ptyProcess.write(data);
    } 
  })


    socket.on("terminal:create", (terminalId) => {
       // console.log("terminal created", terminalId);
        createTerminal(terminalId)
    })
    
      
    // socket.on("terminal:write", (data) => {
    //     ptyProcess.write(data);
    // }) // data comes from frontend
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });
     // Add these handlers to your existing socket.io server
socket.on('join-video-call', (roomId) => {
  try {
    console.log(`User ${socket.id} joining video call in room ${roomId}`);
    socket.join(roomId);
    
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      const usersInRoom = Array.from(room).filter(id => id !== socket.id);
      console.log(`Sending all-users to ${socket.id} with users:`, usersInRoom);
      socket.emit('all-users', usersInRoom);
    }
  } catch (err) {
    console.error('Error in join-video-call:', err);
  }
});

socket.on('sending-signal', ({ userToSignal, callerID, signal }) => {
  try {
    console.log(`User ${socket.id} sending signal to ${userToSignal}`);
    io.to(userToSignal).emit('user-joined', { signal, callerID });
  } catch (err) {
    console.error('Error in sending-signal:', err);
  }
});

socket.on('returning-signal', ({ signal, callerID }) => {
  try {
    console.log(`User ${socket.id} returning signal to ${callerID}`);
    io.to(callerID).emit('receiving-returned-signal', { signal, id: socket.id });
  } catch (err) {
    console.error('Error in returning-signal:', err);
  }
});

socket.on('leave-video-call', (roomId) => {
  try {
    console.log(`User ${socket.id} leaving video call in room ${roomId}`);
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', socket.id);
  } catch (err) {
    console.error('Error in leave-video-call:', err);
  }
});

socket.on('disconnect', () => {
  console.log(`User ${socket.id} disconnected`);
  // Get all rooms this socket was in
  const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
  rooms.forEach(roomId => {
    socket.to(roomId).emit('user-left', socket.id);
  });
});
    // Broadcast file changes to room
    socket.on("file:change", async ({ path, content, roomId }) => {
      try {
        await fs.writeFile(`./user/${path}`, content);
        socket.to(roomId).emit("file:change", { path, content });
      } catch (error) {
        console.error('Error saving file:', error);
      }
    });

    socket.on('file:create', async ({ path: relativePath, type }) => {
        try {
            console.log(`Creating ${type}:`, relativePath);
            
          const fullPath = path.join("./user", relativePath);
          console.log(fullPath);
          
          if (type === 'folder') {
            await fs.mkdir(fullPath, { recursive: true });
          } else {
            await fs.writeFile(fullPath, '', { flag: 'wx' });
          }
          socket.emit('file:refresh');
        } catch (error) {
          console.error(`Error creating ${type}:`, error.message);
          //socket.emit('error', { message: error.message });
        }
      });
  });

import router from "./routes/ide.routes.js"


app.use("/api", router)


export { io, server, app}