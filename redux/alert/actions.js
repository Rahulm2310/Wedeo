import {SET_ALERT,REMOVE_ALERT} from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    try {
        const id = uuidv4();
        dispatch({
            type: SET_ALERT,
            payload: { msg, type:alertType, id }
        });

        setTimeout(() => dispatch({
            type: REMOVE_ALERT,
            payload: id
        }), timeout);

    } catch (error) {
        console.log(error);
    }

};

export const removeAlert = (id) => (dispatch)=>{
    try {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        })
    } catch (error) {
        console.log(error);
    }
}