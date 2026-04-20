import express from 'express';
import cors from 'cors';

const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());

app.get('/', (req, res)=>{
    res.json({message: 'codeColab server is running'});
})

import roomRoutes from './routes/room.routes.js'

app.use('/api/rooms', roomRoutes);

export default app;