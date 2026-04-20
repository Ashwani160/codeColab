import http from 'http';
import app from './app.js';

const PORT =process.env.port || 5000;
const httpServer= http.createServer(app);


httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})