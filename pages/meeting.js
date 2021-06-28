import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
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
import {v4 as uuidv4} from 'uuid';
const Picker = dynamic(() => import('emoji-picker-react'),{ssr:false});
// const Peer = dynamic(() => import('peerjs'));

const Meeting = ({isValidMeeting,query,endMeeting,user,profile,clearMessages,updateMessages,removeUser,updateUsers,clearUsers,messages,users,setAlert}) => {
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
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [myScreenStream, setMyScreenStream] = useState(null);
    const [isScreenRecording,setIsScreenRecording] = useState(false);
 
    let recordedStream = [];
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const peers = {};
    

    //socket.io
    const socket = io();

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


        // socket.on("stop-screen-share-now",()=>{
        //     const myVideo = document.querySelector('.screen-share video');
        //     myVideo.muted=true;

        //     const p = document.querySelector('.screen-share-footer p');
        //     p.textContent= "";
        
        //     const videoCard = document.getElementsByClassName('screen-share')[0];
        //     // addScreenShareStream(myVideo, myVideoCard, stream);
        //     myVideo.srcObject=null;
        //     videoCard.style.display="none";
        // });

        // socket.on('update-streams',strms=>{
        //     console.log("updating streams",strms);
        //     streams=strms;
        // });

        return (()=>{
            if(isScreenSharing){
                stopScreenSharing();
            }
            leaveMeetingHandler();
            console.log("use effect cleanup");
        });
    },[])

    const userMediaAvailable = ()=> {
        return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
    }

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
            myVideo.classList.add("local");
            myVideo.muted=true;

            const footer=document.createElement('div');
            footer.classList.add([`${styles.footer}`]);
            const p = document.createElement('p');
            p.textContent='You';
            footer.append(p);
        
            const myVideoCard = document.createElement('div');
            myVideoCard.style.backgroundImage="url(https://www.medtalks.com/images/user-placeholder.jpg)";
            myVideoCard.classList.add([`${styles.videoCard}`]);
            myVideoCard.append(myVideo);
            myVideoCard.append(footer);

            // myVideo.onclose(()=>{
            //     video.style.display="none";
            // });
    
            if(userMediaAvailable()){
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream=>{
                setMyVideoStream(stream);
                addVideoStream(myVideo,myVideoCard,stream);
                updateUsers({uid:user.uid,name:user.name,type:"join",datetime:new Date()},true);
                myPeer.on('call',(call)=>{
                    console.log("Calling...",call.metadata);
                    call.answer(stream);
                    if(!peers[call.metadata.user.uid]){
                        const video = document.createElement('video');
                        video.muted=true;
    
                        const footer=document.createElement('div');
                        footer.classList.add([`${styles.footer}`]);
                        const p = document.createElement('p');
                        p.textContent=call.metadata.user.name;
                        footer.append(p);
    
                        const videoCard = document.createElement('div');
                        videoCard.style.backgroundImage="url(https://www.medtalks.com/images/user-placeholder.jpg)";
                        videoCard.classList.add([`${styles.videoCard}`]);
                        videoCard.append(video);
                        videoCard.append(footer);

                        // video.on('close')
                        // video.onpause(()=>{
                        //     video.style.display="none";
                        // });

                        // video.on('close',()=>{
                        //     video.style.display="none";
                        // });
    
                        call.on('stream',(userVideoStream)=>{
                            addVideoStream(video,videoCard,userVideoStream);
                        });

                        call.on('close',()=>{
                            videoCard.remove();
                            delete peers[call.metadata.user.uid];
                        });

                    }
                    peers[call.metadata.user.uid]=call;
                })

                socket.on('user-joined',user=>{
                    console.log(user.name + " has joined the meeting");
                    connectToNewUser(user,stream);
                    updateUsers({...user,type:"join",datetime:new Date()});
                });

                socket.on('new-screen-share',data=>{
                    const call = myPeer.call(data.user.uid,stream,{metadata:{user:{uid:data.user.uid,name:data.user.name}}});
                    
                    call.on('stream',userVideoStream=>{
                        console.log(data.user.name+ " sharing his screen", userVideoStream);
                        const myVideo = document.querySelector('.screen-share video');
                        myVideo.muted=true;

                        const footer=document.querySelector('.screen-share-footer');
                        const p = document.querySelector('.screen-share-footer p');
                        p.textContent=data.user.name;
                    
                        const videoCard = document.getElementsByClassName('screen-share')[0];
                        myVideo.srcObject=userVideoStream;
                        myVideo.addEventListener('loadedmetadata',()=>{
                            myVideo.play();
                        });
                        videoCard.style.display="block";
                    });

                    call.on('close',()=>{
                        stream.getTracks().forEach((track)=>{
                            track.stop();
                        });
                        videoCard.style.display="none";
                    });
                });
            });
        }

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
                // socket.emit("new-stream",{meetingId:query.id,stream:myStream.id,user:{id:user.uid, name:user.name}});
                const call = myPeer.call(newuser.uid,myStream,{metadata:{user:{uid:user.uid,name:user.name,image:profile?profile.image:""}}});
                if(!peers[newuser.uid]){
                    const video = document.createElement('video');
                    video.muted=true;

                    const footer=document.createElement('div');
                    footer.classList.add([`${styles.footer}`]);
                    const p = document.createElement('p');
                    p.textContent=newuser.name;
                    footer.append(p);

                    const videoCard = document.createElement('div');
                    videoCard.style.backgroundImage="url(https://www.medtalks.com/images/user-placeholder.jpg)";
                    videoCard.classList.add([`${styles.videoCard}`]);
                    videoCard.append(video);
                    videoCard.append(footer);

                    call.on('stream',userVideoStream=>{
                        addVideoStream(video,videoCard,userVideoStream);

                        // video.onclose(()=>{
                        //     video.style.display="none";
                        // });
                    });

                    call.on('close',()=>{
                        console.log(newuser.name + " close peer ");
                        // myStream.getTracks().forEach((track)=>{
                        //     track.stop();
                        // });
                        videoCard.remove();
                        delete peers[newuser.uid];
                    })
                }
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
            if(typeof window!="undefined"){
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

    const screenShareHandler = async ()=>{
        if(!isScreenSharing){
                const Peer = (await import('peerjs')).default;
                const screenUserId = new uuidv4();
                const myScreenPeer = new Peer(screenUserId);
                socket.emit('screen-share',{meetingId:query.id,user:{uid:screenUserId,name:user.name+"'s Screen"}});
                myScreenPeer.on('open',id=>{
                    console.log("my screen sharing peer open");
                });

            navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            }).then(stream=>{
                console.log("screen sharing started...");
                myScreenPeer.on('call',(call)=>{
                    console.log(call.metadata.user.name+" calling...");
                    // if(!peers[user.uid]){
                        // socket.emit("new-stream",{meetingId:query.id,stream:stream.id, user: {uid:user.uid, name:user.name}});
                        call.answer(stream);
                    // }
                })

                const myVideo = document.querySelector('.screen-share video');
                myVideo.muted=true;

                const footer=document.querySelector('.screen-share-footer');
                const p = document.querySelector('.screen-share-footer p');
                p.textContent='Your Screen';
            
                const videoCard = document.getElementsByClassName('screen-share')[0];
                myVideo.srcObject=stream;
                myVideo.addEventListener('loadedmetadata',()=>{
                    myVideo.play();
                });
                videoCard.style.display="block";
                setMyScreenStream(stream);
                setIsScreenSharing(true);

                stream.getVideoTracks()[0].addEventListener( 'ended', () => {
                    stopScreenSharing();
                } );
            });
        }else{
            stopScreenSharing();   
        }
    }

    const stopScreenSharing = async ()=>{
        socket.emit("stop-screen-share",{meetingId:query.id});
        if(myScreenStream){
           await myScreenStream.getTracks().forEach( track => track.stop() );
        }
        let videoCard = document.getElementsByClassName('screen-share')[0]; 
        videoCard.style.display="none";
        setIsScreenSharing(false);
        setMyScreenStream(null);
    }

    const screenRecordingHandler = ()=>{
        if(!isScreenRecording){
            if(userMediaAvailable()){
                navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: "always"
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                }).then(stream=>{
                    const recorder = new MediaRecorder( stream, {
                        mimeType: 'video/webm;codecs=vp9'
                    } );
                    setMediaRecorder(recorder);

                    recorder.start( 1000 );

                    recorder.ondataavailable = function ( e ) {
                        console.log("video recording data...",recordedStream, e);
                        // setRecordedStream([...recordedStream, e.data]);
                        recordedStream.push(e.data);
                    };

                    recorder.onstop = function () {
                        setIsScreenRecording(false);
                        console.log("video recording stopped!!!",recordedStream);
                        saveRecordedStream( recordedStream, meeting.title );

                        setTimeout( () => {
                            recordedStream=[];
                        }, 3000 );
                    };

                    recorder.onerror = function ( e ) {
                        console.error( e );
                    };
                    setIsScreenRecording(true);
            });
        }
        }else{
            if(mediaRecorder){
                mediaRecorder.stop();
            }
            setIsScreenRecording(false);
        }
    }

    const saveRecordedStream = ( stream, meetingTitle ) => {
        let file = new Blob( stream, { type: 'video/webm' } );
        const filename =  `${ meetingTitle }-${ moment().unix() }-record.webm` ;
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
            const a = document.createElement("a");
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
    }
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
        if(isScreenSharing){
            myScreenStream.getTracks().forEach((track)=>{
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
                    <div className={`${styles.videoBox} videoBox`}>
                        <div className={`${styles.screenShareCard} screen-share`}>
                            <video></video>
                            <div className={`${styles.footer} screen-share-footer`}>
                                <p></p>
                            </div>
                        </div>
                        <div className={`${styles.videos} videos`}>
                        </div>
                        <div className={styles.controls}>
                            <div className={styles.controlBtn} onClick={fullScreenHandler}>
                                <span className={styles.tooltip}>Full Screen</span>
                               {!isFullScreen ? <i class="fas fa-arrows-alt" aria-hidden="true"></i>:
                                <i class="fas fa-compress-arrows-alt" aria-hidden="true"></i>}
                            </div>
                            <div className={styles.controlBtn} onClick={microphoneHandler}>
                            <span className={styles.tooltip}>Audio</span>
                                {!isMic ? <i class="fa fa-microphone-slash" aria-hidden="true"></i>:
                                <i class="fa fa-microphone" aria-hidden="true"></i>
    }
                            </div>
                            <div className={styles.controlBtn} onClick={videoHandler}>
                            <span className={styles.tooltip}>Video</span>
                                {!isVideo? <i class="fas fa-video-slash"></i>:
                                <i class="fa fa-video-camera" aria-hidden="true"></i>}
                            </div>
                            <div className={styles.controlBtn} onClick={incomingAudioHandler}>
                            <span className={styles.tooltip}>Mute</span>
                                {!isIncomingAudio? <i class="fas fa-volume-mute"></i>:
                                <i class="fa fa-volume-up" aria-hidden="true"></i>
}
                            </div>
                            <div className={styles.controlBtn} onClick={screenShareHandler}>
                            <span className={styles.tooltip}>Screen Share</span>
                            {!isScreenSharing?<i class="fa fa-desktop" aria-hidden="true"></i>:
                            <i class="fa fa-times" aria-hidden="true"></i>}
                            </div>
                            <div className={styles.controlBtn} onClick={screenRecordingHandler}>
                            <span className={styles.tooltip}>Record Screen</span>
                            {!isScreenRecording?<i class="fa fa-play-circle" aria-hidden="true"></i>:
                            <i class="fa fa-stop-circle" aria-hidden="true"></i>}
                            </div>
                            
                            <div className={styles.controlBtn} onClick={chatHandler}>
                            <span className={styles.tooltip}>Chat</span>
                                {!isChat? <i class="fas fa-comment-slash"></i>:
                                <i class="fas fa-comment"></i>
}
                            </div>
                            <div className={`${styles.controlBtn} ${styles.leaveBtn}`} onClick={leaveMeetingHandler}>
                            <span className={styles.tooltip}>Leave Meeting</span>
                                <i class="fa fa-phone" aria-hidden="true"></i>
                            </div>
                            {meeting.hostId===user.uid && <>
                            <div className={`${styles.controlBtn} ${styles.endMeeting}`} onClick={()=>{setShowDialog(true)}}>
                            <span className={styles.tooltip}>End Meeting</span>
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
                            { 
                                typeof window!="undefined" && emojiPicker &&
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

const mapStateToProps=({auth,messages, profile})=>({
    user:auth.user,
    messages:messages.messages,
    users:messages.users,
    profile:profile.data,
});

export default connect(mapStateToProps,{isValidMeeting,endMeeting,updateMessages,clearMessages,updateUsers,clearUsers,removeUser,setAlert})(Meeting);
