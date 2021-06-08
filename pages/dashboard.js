import React,{useState} from 'react'
import { connect } from 'react-redux';
import AuthContainer from '../components/AuthContainer';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import BaseLayout from '../components/BaseLayout';
import styles from '../styles/Dashboard.module.css';
import JoinModal from '../components/JoinModal';
import HostModal from '../components/HostModal';
// import Footer from '../components/Footer';

const Dashboard = ({isDarkMode}) => {
    const [joinModalShow,setJoinModalShow] = useState(false);
    const [hostModalShow,setHostModalShow] = useState(false);
    return (
        <BaseLayout>
        <AuthContainer>
            <Navbar/>
            <div className={`${styles.cards} ${isDarkMode?styles.cardsDark:""}`}>
                <div className={`${styles.card} ${styles.joinCard}`} onClick={()=>{setHostModalShow(false);setJoinModalShow(true);}}>
                    <img className={styles.cardImage} src='/static/images/join-meet.svg'/>
                    <div className={styles.cardText}>Join a Meeting</div>
                </div>
                <div className={`${styles.card} ${styles.hostCard}`} onClick={()=>{setJoinModalShow(false);setHostModalShow(true)}}>
                    <img className={styles.cardImage} src='/static/images/host-meet.svg'/>
                    <div className={styles.cardText}>Host a Meeting</div>
                </div>
                <Link href="/meetings">
                <div className={`${styles.card} ${styles.myMeetingsCard}`} onClick={()=>{}}>
                    <img className={styles.cardImage} src='/static/images/my-meetings.svg'/>
                    <div className={styles.cardText}>My Meetings</div>
                </div>
                </Link>
            </div>
            <JoinModal show={joinModalShow} onClose={()=>{setJoinModalShow(false)}}/>
            <HostModal show={hostModalShow} onClose={()=>{setHostModalShow(false)}}/>
            {/* <Footer/> */}
        </AuthContainer>
        </BaseLayout>
    )
}

const mapStateToProps = ({theme})=>({
    isDarkMode:theme.isDarkMode
});

// const mapDispatchToProps = (dispatch)=>({
//     logoutUserAction : async ()=>dispatch(await logoutUser())
// });

export default connect(mapStateToProps,null)(Dashboard);
