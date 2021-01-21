import {CREATE_MEET,JOIN_MEET,MEET_ERROR,CREATED_MEET,UPDATE_MEET,DELETE_MEET} from './types';
import {v4 as uuidv4} from 'uuid';
import {database,auth} from '../../firebase/firebaseApp';
import { setAlert } from '../alert/actions';

export const createMeeting = ({title,datetime})=>async(dispatch)=>{
    try {
        dispatch({
            type:CREATE_MEET
        });
        let id = uuidv4().substring(0,8);
        let meet = (await database.ref('/meetings/'+id).once('value')).exists();
        while(meet){
            id = uuidv4().substring(0,8);
            meet = (await database.ref('/meetings/'+id).once('value')).exists();
        }
            const password = uuidv4().substring(0,8);
            const user=auth.currentUser;
            const meeting = {id:id,title:title,datetime:datetime.toString(),createdAt:new Date().toString(),password:password,hostId:user.uid,hostName:user.displayName};
            await database.ref('/meetings/'+id).set(meeting);
            dispatch({
                type:CREATED_MEET,
                payload:meeting
            })
            dispatch(setAlert('Meeting created successfully','success'));
            return {id,password};
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Error creating meeting. Please try again','warning'));
        dispatch({
            type:MEET_ERROR,
            payload:'Error creating meeting. Please try again'
        });
    }
}

export const updateMeeting = (meeting)=>async (dispatch)=>{
    try {
        dispatch({
            type:CREATE_MEET
        });
        await database.ref('/meetings/'+meeting.id).set(meeting);
        dispatch({
            type:UPDATE_MEET,
            payload:meeting
        });
        dispatch(setAlert('Meeting updated successfully','success'));

    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to update meeting. Please try again','warning'));
        dispatch({
            type:MEET_ERROR,
            payload:'Failed to update meeting. Please try again'
        });
    }
}

export const deleteMeeting = (id)=>async(dispatch)=>{
    try {
        await database.ref('/meetings/'+id).remove();
        dispatch({
            type:DELETE_MEET,
            payload:id
        });
        dispatch(setAlert('Meeting deleted successfully','success'));
    } catch (error) {
        dispatch(setAlert('Failed to delete meeting. Please try again','warning'));
        dispatch({
            type:MEET_ERROR,
            payload:'Failed to delete meeting. Please try again'
        });
    }
}

export const isValidMeeting = (id,pass)=>async(dispatch)=>{
    try {
        const meeting = await database.ref('/meetings/'+id).once('value');
        console.log(id,pass,meeting.val());
        if(!meeting.exists()){
            dispatch(setAlert('Invalid Meeting Id or Password','error'));
            return {
                status:404,message:'failed'
            }
        }else{
            const meet = meeting.val();
            console.log(meet);
            if(meet.password===pass){
                if(new Date()<=new Date(meet.datetime)){
                    dispatch(setAlert('Meeting has not started yet','error'));
                    return {
                        status:404,message:'failed'
                    }
                }else{
                    return {
                        status:200,message:'success',data:meet
                    }
                }
            }else{
                dispatch(setAlert('Invalid Meeting Id or Password','error'));
                return {
                    status:404,message:'failed'
                }
            }
        }
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Unable to join meeting. Please try again','error'));
        
    }
}

export const startMeeting = (meeting) => async (dispatch) => {
    try {
        console.log("start meet :",meeting);
        const meet = {...meeting,startedAt:new Date().toString()};
        await database.ref('/meetings/'+meeting.id).set(meet);
        // console.log(meet);
        dispatch({
            type:UPDATE_MEET,
            payload:meet
        });
        dispatch(setAlert('Meeting Started','success'));
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to start meeting. Please try again','error'));
    }
}

export const endMeeting = (meeting) => async (dispatch)  => {
    try {
        console.log("end meet :",meeting);
        const meet = {...meeting,endedAt:new Date().toString()};
        await database.ref('/meetings/'+meeting.id).set(meet);
        dispatch({
            type:UPDATE_MEET,
            payload:meet
        });
        dispatch(setAlert('Meeting Ended','success'));
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to end meeting. Please try again','error'));
    }
}