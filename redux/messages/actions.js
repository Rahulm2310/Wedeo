import { setAlert } from "../alert/actions";

export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const UPDATE_USERS = 'UPDATE_USERS';
export const REMOVE_USER = 'REMOVE_USER';
export const CLEAR_USERS = 'CLEAR_USERS';

export const updateMessages = (msg)=>(dispatch)=>{
    try {
        dispatch({
            type:UPDATE_MESSAGES,
            payload:msg
        })
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to send message','error'));
    }
}

export const clearMessages = ()=>(dispatch)=>{
    try {
        dispatch({
            type:CLEAR_MESSAGES
        });
    } catch (error) {
        console.log(error);
    }
}


export const updateUsers = (user,self=false)=>(dispatch)=>{
    try {
        dispatch({
            type:UPDATE_USERS,
            payload:user
        })
        if(!self){
            dispatch(setAlert(`${user.name} has ${user.type=="join"?"joined":"left"} the meeting`,'info'));
        }
    } catch (error) {
        console.log(error);
        // dispatch(setAlert('Failed to send message','error'));
    }
}

export const removeUser = (user)=>(dispatch)=>{
    try {
        dispatch({
            type:REMOVE_USER,
            payload:user
        })
        // dispatch(setAlert(`${user.name} has left the meeting`,'info'));
    } catch (error) {
        console.log(error);
        // dispatch(setAlert('Failed to send message','error'));
    }
}

export const clearUsers = ()=>(dispatch)=>{
    try {
        dispatch({
            type:CLEAR_USERS
        });
    } catch (error) {
        console.log(error);
    }
}
