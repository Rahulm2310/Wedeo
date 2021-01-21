import {SIGNIN_SUCCESS,SIGNUP_SUCCESS,AUTH_ERROR,LOGOUT} from './types';
import {auth,database,googleSignIn,facebookSignIn} from '../../firebase/firebaseApp';
import { setAlert } from '../alert/actions';

export const signUpUser= (name,email,password) => async(dispatch)=> {
    try {
        const user = await auth.createUserWithEmailAndPassword(email,password);
        await user.user.updateProfile({displayName:name});
        database.ref('users/'+user.user.uid).set({name:name,email:user.user.email,createdAt:user.user.metadata.creationTime});
        dispatch({
            type:SIGNUP_SUCCESS,
            payload: {uid:user.user.uid,name:name,email:user.user.email,createdAt:user.user.metadata.creationTime}
        });
    } catch (error) {
        // console.log("error",error);
        dispatch(setAlert("Failed to Sign Up. Please Try again",'danger'));
        dispatch({
            type:AUTH_ERROR,
            payload:"Failed to Sign Up. Please Try again"
        });
        
    }
}

export const signInUser= (email,password) =>async(dispatch) => {
    try {
        const user = await auth.signInWithEmailAndPassword(email,password);
        dispatch({
            type:SIGNIN_SUCCESS,
            payload: {uid:user.user.uid,name:user.user.displayName,email:user.user.email,createdAt:user.user.metadata.creationTime}
        });
    } catch (error) {
        // console.log("error",error);
        dispatch(setAlert("Failed to Sign In. Please Try again",'danger'));
        dispatch({
            type:AUTH_ERROR,
            payload:"Failed to Sign In. Please Try again"
        });
        
    }
}

export const signInWithGoogle = ()=> async(dispatch)=>{
    try {
       const user = await googleSignIn();
       if(user.additionalUserInfo.isNewUser){
            database.ref('users/'+user.user.uid).set({name:user.user.displayName,email:user.user.email,createdAt:user.user.metadata.creationTime});
       }
       dispatch({
        type:SIGNIN_SUCCESS,
        payload: {uid:user.user.uid,name:user.user.displayName,email:user.user.email,createdAt:user.user.metadata.creationTime}
    });
    } catch (error) {
        console.log("error",error);
        dispatch(setAlert(error.message,'danger'));
        dispatch({
            type:AUTH_ERROR,
            payload:error.message
        });
    }
}

export const signInWithFacebook = ()=>async(dispatch)=>{
    try {
       const user = await facebookSignIn();
       if(user.additionalUserInfo.isNewUser){
            database.ref('users/'+user.user.uid).set({name:user.user.displayName,email:user.user.email,createdAt:user.user.metadata.creationTime});
       }
       dispatch({
        type:SIGNIN_SUCCESS,
        payload: {uid:user.user.uid,name:user.user.displayName,email:user.user.email,createdAt:user.user.metadata.creationTime}
    });
    } catch (error) {
        console.log("error",error);
        dispatch(setAlert(error.message,'danger'));
        dispatch({
            type:AUTH_ERROR
        });
    }
}

export const logoutUser =() => async(dispatch)=>{
    try {
        await auth.signOut();
        dispatch({
            type:LOGOUT
        });
    } catch (error) {
        dispatch(setAlert(error.message,'danger'));
        console.log(error);
    }
}