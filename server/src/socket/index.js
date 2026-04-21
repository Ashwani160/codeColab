import {Server} from "socket.io";
import roomHandlers from "./roomHandlers.js"

const initSocket=(httpServer)=>{
    const io= new Server(httpServer,{
        cors:{
            origin:process.env.CLIENT_URL || 'http://localhost:5173',
            methods:['GET', 'POST']
        }
    })

    io.on('connection', (socket)=>{
        console.log('New client connected: ', socket.id);
        roomHandlers(io, socket);
    })
}
export default initSocket;