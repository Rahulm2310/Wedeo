import React, { useState,useEffect } from 'react';
import styles from '../styles/Modal.module.css';
import DateTime from 'react-datetime';
import {createMeeting,updateMeeting} from '../redux/meeting/actions';
import { connect } from 'react-redux';
import { setAlert } from '../redux/alert/actions';
import moment from 'moment';
import Spinner from './Spinner';
import {FacebookShareButton,FacebookIcon,WhatsappShareButton,WhatsappIcon,TelegramShareButton,TelegramIcon,LinkedinShareButton,LinkedinIcon} from 'react-share';
import { toggleTheme } from '../redux/theme/actions';

const HostModal = ({show,onClose,createMeeting,setAlert,loading,user,edit,mId,updateMeeting,meetings,isDarkMode}) => {
    const [meeting,setMeeting] = useState({title:'',datetime:new Date().toString(),id:'',password:''});
    const {title,datetime,id,password}=meeting;
    const [invite,setInvite] = useState("");

    useEffect(()=>{
        if(edit){
            const m = meetings.filter(meet=>meet.id===mId)[0];
            if(m){
                setMeeting({title:m.title,datetime:m.datetime,id:'',password:m.password});
            }         
        }
    },[]);

    const onChangeMeetingData = (e)=>{
        setMeeting({...meeting,[e.target.name]:e.target.value});
    }

    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        if(!title || !datetime){
            setAlert("Please select meeting title and time.",'warning');
        }else{
            let isValid = moment(new Date(datetime)).isValid();
            console.log('moment'+ isValid);
            if(!isValid){
                setAlert("Please select a valid meeting time.",'warning');
            }else{
                let mdata;
                if(edit){
                    const m = meetings.filter(meet=>meet.id===mId)[0];
                    console.log("edit meet : ",m,meeting);
                    await updateMeeting({...m,...meeting,id:mId});
                    // setMeeting({...meeting,id:mId});
                    mdata = {id:mId,password:password};
                }else{
                    mdata = await createMeeting({title:title,datetime:datetime});
                    setMeeting({...meeting,id:mdata.id,password:mdata.password});
                }
                console.log(mdata);
                setInvite(`*Wedeo Meeting Invitation* \n\n ${user.name} is inviting you to attend a meeting. \n\n *Meeting Details* \n Title: ${title} \n Timing : ${datetime} \n ID : ${mdata.id} \n Password : ${mdata.password} \n\n\n Regards, \n *Team Wedeo*`);
            }      
        }
        
    }

    return show?(
        <div className={`${styles.modalBack} ${isDarkMode?styles.modalBackDark:""}`}>
            <div className={styles.modal}>
            <form action="#" className={styles.form} onSubmit={onSubmitHandler}>
                <i className={`fa fa-times ${styles.crossBtn}`} aria-hidden="true" onClick={onClose}></i>
                <h1 className={styles.head}>{!edit?'Host a Meeting':'Edit Meeting'}</h1>
                {!loading ? (!id?(<div>
                <span className={styles.span}>Enter Meeting Details</span>
                <input name="title" value={title} className={styles.input} type="text" placeholder="Meeting Title" required onChange={onChangeMeetingData}/>
                <DateTime className={`${isDarkMode?styles.dateTimePicker:""}`} value={new Date(datetime)} onChange={(date)=>{if(date._isValid){setMeeting({...meeting,datetime:date._d.toString()})}else{setAlert("Please select a valid meeting time.",'warning')}}}/>
                <button className={styles.button} type="submit">{!edit?'Create':'Update'}</button>
                </div>):(<div><p className={styles.span}>Meeting Details</p><br/><p className={styles.span}><strong>Meeting ID</strong> : {id}</p><p className={styles.span}><strong>Meeting Password</strong> : {password}</p><br/><div className={styles.socialShare}><p className={styles.span}>Share meeting invite</p><WhatsappShareButton url={'https://localhost:3000'} title={invite}><WhatsappIcon size={40} borderRadius={20} /></WhatsappShareButton> <TelegramShareButton url={'https://localhost:3000'} title={invite}><TelegramIcon size={40} borderRadius={20}/></TelegramShareButton> <FacebookShareButton url={'https://localhost:3000'} quote={invite}><FacebookIcon size={40} borderRadius={20}/></FacebookShareButton> <LinkedinShareButton url={'https://localhost:3000'} source={'https://localhost:3000'} quote={invite}><LinkedinIcon size={40} borderRadius={20}/></LinkedinShareButton></div></div>)):<Spinner/>}
		    </form>
            </div>
        </div>
    ):null
}

const mapStateToProps = ({meeting,auth,theme})=>({
    loading:meeting.loading,
    user:auth.user,
    meetings:meeting.meetings,
    isDarkMode:theme.isDarkMode
});

export default connect(mapStateToProps,{createMeeting,setAlert,updateMeeting})(HostModal);