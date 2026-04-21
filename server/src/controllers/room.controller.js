import Room from "../models/Room.js"
import generateRoomId from "../utils/generateRoomId.js"
import catchAsync from "../utils/catchAsync.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const createRoom= catchAsync(async(req , res)=>{
    const roomId=generateRoomId();
    const room = await Room.create({roomId});
    res.status(201).json(new ApiResponse(201, {roomId: room.roomId}, "Room created successfully"));

})

const getRoom= catchAsync(async(req, res)=>{
    const {roomId}=req.params;
    const room = await Room.findOne({roomId: roomId});
    if(!room){
        throw new ApiError(404, "Room Not Found!");
    }
    res.json(new ApiResponse(200, {roomId: roomId, code: room.code, language: room.language}));
    
})

export {
    createRoom,
    getRoom
}
