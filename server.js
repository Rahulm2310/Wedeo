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

    io.on('connection',socket=>{
        socket.on('join-meet',(meetingId,user)=>{
            console.log(meetingId,user);
            socket.join(meetingId);
            socket.to(meetingId).broadcast.emit('user-joined',user);

            socket.on('disconnect',()=>{
                socket.to(meetingId).broadcast.emit('user-left',user);
            });
        });

        socket.on('send-message',(meetingId,msg)=>{
            console.log(meetingId,msg);
            socket.to(meetingId).emit('user-message',msg);
        })
    });

    server.listen(3000,(err)=>{
        if(err) throw err;
        console.log("Server running");
    });
}).catch((err)=>{
    console.error(err.stack);
    process.exit(1);
});