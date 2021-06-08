import React,{useEffect, useState} from 'react'
import { connect } from 'react-redux'
import AuthContainer from '../components/AuthContainer';
import BackButton from '../components/BackButton';
import BaseLayout from '../components/BaseLayout';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import styles from '../styles/Meetings.module.css';
import MeetingCard from '../components/MeetingCard';
import { fetchUserMeetings } from '../redux/meeting/actions';

const Meetings = ({meeting,user,fetchUserMeetings,isDarkMode}) => {
    const {meetings,loading,error} = meeting;
    const [activeIndex,setActiveIndex]=useState(0);
    const [upcoming,setUpcoming] = useState([]);
    const [past,setPast] = useState([]);

    useEffect(()=>{
        const getMeetings = async()=>{
            await fetchUserMeetings(user.uid);
        }
        getMeetings();
    },[]);

    useEffect(()=>{
        let upc=[];
        let pst=[];
        meetings.forEach(m=>{
            if(m.endedAt){
                pst.push(m);
            }else{
                upc.push(m);
            }
        });
        setUpcoming(upc);
        setPast(pst);
    },[meetings])

    return <BaseLayout>
    <AuthContainer>
        <Navbar/>
    <div className={`${styles.container} ${isDarkMode?styles.containerDark:""}`}>
        <BackButton route="/dashboard"/>
        <div className={styles.header}>
        <h1 className={styles.heading}>My Meetings</h1>
       
        <div className={styles.buttonRow}>
        <div className={activeIndex==0 ? `${styles.filterButton} ${styles.activeButton}`:styles.filterButton} onClick={()=>{setActiveIndex(0)}}>
            Upcoming
        </div>
        <div className={activeIndex==1 ? `${styles.filterButton} ${styles.activeButton}`:styles.filterButton} onClick={()=>{setActiveIndex(1)}}>
            Past
        </div>
        </div>
        </div>
        {loading?<Spinner/>:<>
        {/* {meetings.length>0? */}
        <div className={styles.meetingList}>{
            activeIndex==0?
            (upcoming.length>0? (upcoming.map(meet=><MeetingCard key={meet.id} meeting={meet}/>)): (<div className={styles.noMeetings}><img src="/static/images/my-meetings.svg" alt="no-meetings"/> No upcoming meetings. Host Now!</div>)):
            (past.length>0? (past.map(meet=><MeetingCard key={meet.id} meeting={meet}/>)): (<div className={styles.noMeetings}><img src="/static/images/my-meetings.svg" alt="no-meetings"/>No hosted meetings. Host Now!</div>))
        }     
        </div>
        {/* :
        <div className={styles.noMeetings}>No meetings scheduled</div>
        } */}
    </>}
    </div>
    </AuthContainer>
    </BaseLayout>
}

const mapStateToProps = ({meeting,auth,theme})=>({
    meeting,
    user:auth.user,
    isDarkMode:theme.isDarkMode
});

export default connect(mapStateToProps,{fetchUserMeetings})(Meetings);
