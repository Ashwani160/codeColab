import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import initSocket from './socket/index.js';

dotenv.config();
const PORT =process.env.PORT || 5000;

connectDB();

const httpServer= http.createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})