import React, { useState } from 'react';
import {useRouter} from 'next/router';
import { connect } from 'react-redux';
import { isValidMeeting } from '../redux/meeting/actions';
import styles from '../styles/Modal.module.css';

const JoinModal = ({show,onClose,isValidMeeting,isDarkMode}) => {
    const [meeting,setMeeting] = useState({id:'',password:''});
    const {id,password} = meeting;
    const Router = useRouter();
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        const res = await isValidMeeting(id,password);
        if(res.status===200){        
            Router.push({pathname:'/meeting',query:{id:id,password:password}});
        }
    }
    const onChangeMeetingData = (e)=>{
        setMeeting({...meeting,[e.target.name]:e.target.value});
    }
    return show?(
        <div className={`${styles.modalBack} ${isDarkMode?styles.modalBackDark:""}`}>
            <div className={styles.modal}>
            <form action="#" className={styles.form} onSubmit={onSubmitHandler}>
                <i className={`fa fa-times ${styles.crossBtn}`} aria-hidden="true" onClick={onClose}></i>
                <h1 className={styles.head}>Join a Meeting</h1>
                <span className={styles.span}>Enter your Meeting Id & Passsword</span>
                <input name="id" value={meeting.name} className={styles.input} type="text" placeholder="Meeting Id" required onChange={onChangeMeetingData}/>
                <input name="password" value={meeting.password} className={styles.input} type="text" placeholder="Meeting Password" required onChange={onChangeMeetingData}/>
                <button className={styles.button} type="submit">Join</button>
		    </form>
            </div>
        </div>
    ):null
}

const mapStateToProps = ({theme})=>({
    isDarkMode:theme.isDarkMode
});

export default connect(mapStateToProps,{isValidMeeting})(JoinModal);