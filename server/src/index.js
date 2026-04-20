import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const PORT =process.env.port || 5000;

connectDB();

const httpServer= http.createServer(app);


httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})