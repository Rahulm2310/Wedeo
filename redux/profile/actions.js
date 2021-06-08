import { auth, database } from "../../firebase/firebaseApp";
import { setAlert } from "../alert/actions";
import { logoutUser } from "../auth/actions";
import { LOGOUT } from "../auth/types";
import { GET_PROFILE_REQUEST,GET_PROFILE_SUCCESS,GET_PROFILE_FAILURE,DELETE_PROFILE_REQUEST,DELETE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST,UPDATE_PROFILE_SUCCESS,UPDATE_PROFILE_FAILURE, DELETE_PROFILE_SUCCESS } from "./types";

export const getProfile = (id)=>async (dispatch)=>{
    try {
        dispatch({
            type:GET_PROFILE_REQUEST
        });

        const profile = await (await database.ref("profiles/"+id).once('value')).val();
        // console.log(profile);
        dispatch({
            type:GET_PROFILE_SUCCESS,
            payload:profile
        });
    } catch (error) {
        dispatch({
            type:GET_PROFILE_FAILURE
        })
    }
}

export const updateProfile = (id,data)=>async (dispatch)=>{
    try {
        dispatch({
            type:UPDATE_PROFILE_REQUEST
        });

        database.ref("profiles/"+id).update(data).then(()=>{   
            dispatch({
                type:UPDATE_PROFILE_SUCCESS,
                payload:data
            });
            dispatch(setAlert('Profile updated','success'));
        }).catch((error)=>{
            dispatch(setAlert('Failed to update profile','error'));
            dispatch({
                type:UPDATE_PROFILE_FAILURE
            })
        });

    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to update profile','error'));
        dispatch({
            type:UPDATE_PROFILE_FAILURE
        })
    }
}

export const deleteProfile = (id)=>async (dispatch)=>{
    try {
        dispatch({
            type:DELETE_PROFILE_REQUEST
        });
        
        let user = auth.currentUser;

        user.delete().then(async function() {
            await database.ref("profiles/"+id).remove();
            await database.ref("users/"+id).remove();
    
            dispatch({
                type:DELETE_PROFILE_SUCCESS,
            });
            dispatch(logoutUser());
            dispatch(setAlert('Your account has been deleted','success'));
        }).catch(async function(error) {
            console.log(error);
            dispatch(setAlert('Failed to delete account. Login and try again','error'));
            dispatch(logoutUser());
        });
    } catch (error) {
        console.log(error);
        dispatch(setAlert('Failed to delete account','error'));
        dispatch({
            type:DELETE_PROFILE_FAILURE
        })
    }
}