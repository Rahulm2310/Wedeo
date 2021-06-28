const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app=next({dev});
const handle = app.getRequestHandler();

app.prepare().then(()=>{
    const svr = express();
    const server = require('http').Server(svr);
    const io=require('socket.io')(server);

    svr.get('*',(req,res)=>{
        return handle(req,res);
    });

    let sockets = {};
    let connectedPeers = [];
    // let streams = {};

    io.on('connection',socket=>{
        socket.on('join-meet',(data)=>{
            const {meetingId, user}=data;
            // console.log(meetingId,user);
            socket.join(meetingId);
            if(!sockets[meetingId]){
                sockets[meetingId]=[];
            }
            connectedPeers.push(user);
            sockets[meetingId].push(socket);
            socket.to(meetingId).broadcast.emit('user-joined',user);

            socket.on('disconnect',()=>{
                socket.to(meetingId).broadcast.emit('user-left',user);
                if(sockets[meetingId]){
                    sockets[meetingId]=sockets[meetingId].filter(s=>s!=socket);
                } 
            });
            
        });

        socket.on("screen-share", (data)=>{
            console.log("screen share by ",data.user.name);
            socket.to(data.meetingId).broadcast.emit("new-screen-share",data);
        });

        socket.on("stop-screen-share",(data)=>{
            socket.to(data.meetingId).broadcast.emit("stop-screen-share-now");
        });

        socket.on('send-message',(meetingId,msg)=>{
            // console.log(meetingId,msg);
            socket.to(meetingId).emit('user-message',msg);
        });

        socket.on('end-meet',(meetingId,callback)=>{
            // console.log('end meet socket');
            socket.to(meetingId).broadcast.emit('meeting-ended');
            sockets[meetingId].forEach((s)=>s.leave(meetingId));
            delete sockets[meetingId];
            callback();
        });
    });

    server.listen(3000,(err)=>{
        if(err) throw err;
        console.log("Server running");
    });
}).catch((err)=>{
    console.error(err.stack);
    process.exit(1);
});