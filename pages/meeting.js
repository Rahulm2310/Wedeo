import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import AuthContainer from '../components/AuthContainer';
import BaseLayout from '../components/BaseLayout';
import styles from '../styles/Meeting.module.css';
import {FacebookShareButton,FacebookIcon,WhatsappShareButton,WhatsappIcon,TelegramShareButton,TelegramIcon,LinkedinShareButton,LinkedinIcon} from 'react-share';
import Spinner from '../components/Spinner';
import { connect } from 'react-redux';
import { endMeeting, isValidMeeting } from '../redux/meeting/actions';
import moment from 'moment';
import DialogBox from '../components/DialogBox';
import {io} from 'socket.io-client';
import { clearMessages, updateMessages,updateUsers,removeUser,clearUsers } from '../redux/messages/actions';
import { setAlert } from '../redux/alert/actions';
import Linkify from 'react-linkify';
import Picker from 'emoji-picker-react';

const Meeting = ({isValidMeeting,query,endMeeting,user,clearMessages,updateMessages,removeUser,updateUsers,clearUsers,messages,users,setAlert}) => {
    const router = useRouter();
    const [meeting,setMeeting] = useState(null);
    const [loading,setLoading] = useState(true);
    const [isFullScreen,setIsFullScreen] = useState(false);
    const [isMic,setIsMic] = useState(true);
    const [isVideo,setIsVideo] = useState(true);
    const [isIncomingAudio,setIsIncomingAudio] = useState(false);
    const [isChat,setIsChat] = useState(false);
    const [showInfo,setShowInfo] = useState(false);
    const [invite,setInvite] = useState("");
    const [showDialog,setShowDialog] = useState(false);
    const [messageInput,setMessageInput] = useState('');
    const [myVideoStream,setMyVideoStream] = useState(null);
    const [emojiPicker,setEmojiPicker] = useState(false);

    const peers = {};
    let streams={};

    //socket.io
    const socket = io('/');

    socket.on('user-left',(user)=>{
        if(peers[user.uid]){
            peers[user.uid].close();
        }
        removeUser(user);
        updateUsers({...user,type:"leave",datetime:new Date()});
    });

    socket.on('meeting-ended',()=>{
        setAlert('Host has ended the meeting','info');
        router.push('/dashboard');
    });


    useEffect(()=>{    
        socket.on('user-message',msg=>{
            console.log("user message",msg);
            updateMessages(msg);
        });

        socket.on('update-streams',strms=>{
            console.log("updating streams",strms);
            streams=strms;
        });

        return (()=>{
            leaveMeetingHandler();
            console.log("use effect cleanup");
        });
    },[])

    //peerjs
    const setupVideoCall = async ()=>{
        if(typeof window!="undefined"){
            const Peer = (await import('peerjs')).default;
            const myPeer = new Peer(user.uid);
            myPeer.on('open',id=>{
                console.log("my peer open");
                socket.emit('join-meet',{meetingId:query.id,user:{uid:id,name:user.name}});
            });
            
            const myVideo = document.createElement('video');
            myVideo.muted=true;

            const footer=document.createElement('div');
            footer.classList.add([`${styles.footer}`]);
            const p = document.createElement('p');
            p.textContent='You';
            footer.append(p);
        
            const myVideoCard = document.createElement('div');
            myVideoCard.classList.add([`${styles.videoCard}`]);
            myVideoCard.append(myVideo);
            myVideoCard.append(footer);
    
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream=>{
                setMyVideoStream(stream);
                addVideoStream(myVideo,myVideoCard,stream);
                updateUsers({uid:user.uid,name:user.name,type:"join",datetime:new Date()},true);
                myPeer.on('call',(call)=>{
                    if(!peers[user.uid]){
                        // socket.emit("new-stream",{meetingId:query.id,stream:stream.id, user: {uid:user.uid, name:user.name}});
                        call.answer(stream);
                        const video = document.createElement('video');
                        video.muted=true;
    
                        const footer=document.createElement('div');
                        footer.classList.add([`${styles.footer}`]);
                        const p = document.createElement('p');
                        p.textContent=user.name;
                        footer.append(p);
    
                        const videoCard = document.createElement('div');
                        videoCard.classList.add([`${styles.videoCard}`]);
                        videoCard.append(video);
                        videoCard.append(footer);
    
                        call.on('stream',(userVideoStream)=>{
                            console.log("my peer call on stream", userVideoStream, streams[userVideoStream.id]);
                            p.textContent=streams[userVideoStream.id].name;
                            addVideoStream(video,videoCard,userVideoStream);
                        });
                        peers[user.uid]=call;
                    }
                })

                socket.on('user-joined',user=>{
                    console.log("user joined event");
                    connectToNewUser(user,stream);
                    updateUsers({...user,type:"join",datetime:new Date()});
                });
            });

            const addVideoStream = (video,videoCard,stream)=>{
                if(typeof window!="undefined"){
                    video.srcObject=stream;
                    video.addEventListener('loadedmetadata',()=>{
                        video.play();
                    });
                    let videoGrid = document.getElementsByClassName('videos')[0]; 
                    if(videoGrid){              
                        videoGrid.append(videoCard);
                    }
                }
            }

            
            const connectToNewUser = (newuser,myStream)=>{
                if(typeof window!="undefined"){
                console.log("newuser joined event",newuser,myStream);
                socket.emit("new-stream",{meetingId:query.id,stream:myStream.id,user:{id:user.uid, name:user.name}});
                const call = myPeer.call(newuser.uid,myStream);
                const video = document.createElement('video');
                video.muted=true;
                
                const footer=document.createElement('div');
                footer.classList.add([`${styles.footer}`]);
                const p = document.createElement('p');
                p.textContent=newuser.name;
                footer.append(p);

                const videoCard = document.createElement('div');
                videoCard.classList.add([`${styles.videoCard}`]);
                videoCard.append(video);
                videoCard.append(footer);

                call.on('stream',userVideoStream=>{
                    addVideoStream(video,videoCard,userVideoStream);
                });

                call.on('close',()=>{
                    myStream.getTracks().forEach((track)=>{
                        track.stop();
                    });
                    videoCard.remove();
                })

                peers[newuser.uid]=call;
            }
            }
        
        }
    }

    const emojiPickerHandler = (event,emoji)=>{
        setMessageInput(messageInput+emoji.emoji);
    }
    

    useEffect(()=>{
        const checkMeeting = async()=>{
            const res = await isValidMeeting(query.id,query.password);
            if(res.status===200){
                const meet = res.data;
                setMeeting(res.data);
                setInvite(`*Wedeo Meeting Invitation* \n\n ${meet.hostName} is inviting you to attend a meeting. \n\n *Meeting Details* \n Title: ${meet.title} \n Timing : ${meet.datetime} \n ID : ${meet.id} \n Password : ${meet.password} \n\n\n Regards, \n *Team Wedeo*`);
                //load meeting data
                setupVideoCall();
                setLoading(false);
            }else{
                router.push('/dashboard');
            }
        }
        checkMeeting();
    },[]);

    const fullScreenHandler = ()=>{
        if(typeof window!="undefined"){
        if(isFullScreen){
            document.exitFullscreen();
        }else{
             document.getElementsByTagName('body')[0].requestFullscreen();
        }
        
        setIsFullScreen(!isFullScreen);
    }
    }

    const microphoneHandler = ()=>{
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getAudioTracks()[0].enabled = false;
        } else {
            myVideoStream.getAudioTracks()[0].enabled = true;
        }
       setIsMic(!isMic);
    }

    const videoHandler = ()=>{
        const enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getVideoTracks()[0].enabled = false;
        } else {
            myVideoStream.getVideoTracks()[0].enabled = true;
        }
        setIsVideo(!isVideo);
    }

    const incomingAudioHandler = ()=>{
        if(typeof window!="undefined"){
        const videos = document.querySelectorAll('video');
        if(isIncomingAudio){
            videos.forEach(v=>{
                v.muted=true;
            });
        }else{
            videos.forEach(v=>{
                v.muted=false;
            });
        }     
        setIsIncomingAudio(!isIncomingAudio);
    }
    }

    const screenShareHandler = ()=>{
        navigator.mediaDevices.getDisplayMedia().then(stream=>{
            setMyVideoStream(stream);
        });
    }

    const chatHandler = ()=>{
        setIsChat(!isChat);
    }

    const endMeetingHandler = ()=>{
        socket.emit('end-meet',query.id,async ()=>{
            await endMeeting(meeting);
            clearMessages();
            clearUsers();
            router.push('/dashboard');
        });  
    }

    const sendMessage = ()=>{
        const msg = {
            sender:{
                uid:user.uid,
                name:user.name
            },
            body:messageInput,
            createdAt:new Date()
        }

        socket.emit('send-message',query.id,msg);
        setMessageInput("");
    }

    const leaveMeetingHandler = ()=>{
        if(myVideoStream){
            myVideoStream.getTracks().forEach((track)=>{
                track.stop();
            });
        }
        socket.disconnect();
        clearMessages();
        clearUsers();
        router.push('/dashboard');
    }

    return (
        <BaseLayout>
        <AuthContainer>
        <div className={styles.container}>
            {loading?<Spinner/>:<>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        Wedeo
                    </div>
                    <div className={styles.title}>
                         {meeting.title}
                    </div>
                    <div className={styles.infoBtn} onClick={()=>{setShowInfo(true)}}>
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </div>
                    {showInfo && <div className={styles.infoModal}>
                        <i class="fa fa-times" aria-hidden="true" onClick={()=>{setShowInfo(false)}}></i>
                        <div className={styles.infoHeading}>Meeting Details</div> 
                        <p className={styles.started}>Meeting started {moment(new Date(meeting.datetime)).fromNow()}</p>

                        <p><strong>Title</strong> : {meeting.title}</p>
                        <p><strong>Host</strong> : {meeting.hostName}</p>
                        <p><strong>User Activity Log</strong></p>   
                        <div className={styles.userList}>
                            {users && users.map(u=><div className={styles.userListUser}>
                                <p><strong>{u.uid==user.uid?'You' : u.name}</strong> <span>{u.type==="join"?"joined":"left"} at {moment(u.datetime).format('LT')}</span></p>
                            </div>)}
                        </div>
                        <div className={styles.socialShare}>
                        <p>Share meeting invite</p>
                        <div className={styles.socialIcons}>
                        <WhatsappShareButton className={styles.socialIcon} url={'https://localhost:3000'} title={invite}><WhatsappIcon size={40} borderRadius={20} /></WhatsappShareButton> <TelegramShareButton className={styles.socialIcon} url={'https://localhost:3000'} title={invite}><TelegramIcon size={40} borderRadius={20}/></TelegramShareButton> <FacebookShareButton className={styles.socialIcon} url={'https://localhost:3000'} quote={invite}><FacebookIcon size={40} borderRadius={20}/></FacebookShareButton> <LinkedinShareButton className={styles.socialIcon} url={'https://localhost:3000'} source={'https://localhost:3000'} quote={invite}><LinkedinIcon size={40} borderRadius={20}/></LinkedinShareButton>
                            </div>
                            </div>
                    </div>
                    }
                </div>
                <div className={styles.meeting}>
                    <div className={styles.videoBox}>
                        <div className={`${styles.videos} videos`}>
                        </div>
                        <div className={styles.controls}>
                            <div className={styles.controlBtn} onClick={fullScreenHandler}>
                               {!isFullScreen ? <i class="fas fa-arrows-alt" aria-hidden="true"></i>:
                                <i class="fas fa-compress-arrows-alt" aria-hidden="true"></i>}
                            </div>
                            <div className={styles.controlBtn} onClick={microphoneHandler}>
                                {!isMic ? <i class="fa fa-microphone-slash" aria-hidden="true"></i>:
                                <i class="fa fa-microphone" aria-hidden="true"></i>
    }
                            </div>
                            <div className={styles.controlBtn} onClick={videoHandler}>
                                {!isVideo? <i class="fas fa-video-slash"></i>:
                                <i class="fa fa-video-camera" aria-hidden="true"></i>}
                            </div>
                            <div className={styles.controlBtn} onClick={incomingAudioHandler}>
                                {!isIncomingAudio? <i class="fas fa-volume-mute"></i>:
                                <i class="fa fa-volume-up" aria-hidden="true"></i>
}
                            </div>
                            <div className={styles.controlBtn} onClick={screenShareHandler}>
                            <i class="fa fa-desktop" aria-hidden="true"></i>
                            </div>
                            <div className={styles.controlBtn} onClick={chatHandler}>
                                {!isChat? <i class="fas fa-comment-slash"></i>:
                                <i class="fas fa-comment"></i>
}
                            </div>
                            <div className={`${styles.controlBtn} ${styles.leaveBtn}`} onClick={leaveMeetingHandler}>
                                <i class="fa fa-phone" aria-hidden="true"></i>
                            </div>
                            {meeting.hostId===user.uid && <>
                            <div className={`${styles.controlBtn} ${styles.endMeeting}`} onClick={()=>{setShowDialog(true)}}>
                                {typeof window.orientation!='undefined'? 'End': 'End Meeting'}
                            </div>
                            <DialogBox show={showDialog} question={'Are you sure you want to end this meeting for all?'} clickOk={endMeetingHandler} clickCancel={()=>{setShowDialog(false)}} />
                            </>}
                        </div>
                    </div>
                    {isChat &&
                    <div className={styles.chatbox}>
                        <div className={styles.chathead}>
                            Group Chat
                            <div className={styles.crossBtn} onClick={chatHandler}>
                            <i class="fa fa-times-circle" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className={styles.messages}>
                        {
                            messages.map((m)=>
                            <div className={m.sender.uid==user.uid?`${styles.message} ${styles.myMessage}`:styles.message}>
                                <div className={styles.messageSender}><i class="fa fa-user-circle-o" aria-hidden="true"></i> {m.sender.uid==user.uid? 'You' : m.sender.name}</div>
                                <div className={styles.messageBody}><Linkify>{m.body}</Linkify></div>
                                <div className={styles.messageDate}>{moment(m.createdAt).format('LT')}</div>
                            </div>)
                        }
                        </div>
                        <div className={styles.input}>
                            <div className={styles.msgInput}>
                            <input name="message" value={messageInput} onChange={(e)=>{setMessageInput(e.target.value)}} placeholder="Write your message here"/>
                            <i class="fa fa-smile-o" aria-hidden="true" onClick={()=>setEmojiPicker(!emojiPicker)}></i>
                            {typeof window!="undefined" && emojiPicker &&
                            <Picker onEmojiClick={emojiPickerHandler} />
}
                            </div>
                            <button disabled={messageInput.trim().length==0} className={styles.sendBtn} onClick={sendMessage}>
                            <i class="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
}
                </div>
                </>
}
        </div>
  
        </AuthContainer>
        </BaseLayout>
    )
}

Meeting.getInitialProps = async ({query}) => {
    // console.log('query',query);
    return {query:query};
}

const mapStateToProps=({auth,messages})=>({
    user:auth.user,
    messages:messages.messages,
    users:messages.users
});

export default connect(mapStateToProps,{isValidMeeting,endMeeting,updateMessages,clearMessages,updateUsers,clearUsers,removeUser,setAlert})(Meeting);
