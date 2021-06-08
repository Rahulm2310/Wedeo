import {SIGNIN_SUCCESS,SIGNUP_SUCCESS,AUTH_ERROR,LOGOUT} from './types';
import {auth,database,googleSignIn,facebookSignIn} from '../../firebase/firebaseApp';
import { setAlert } from '../alert/actions';
import { UPDATE_PROFILE_SUCCESS } from '../profile/types';

export const signUpUser= (name,email,password) => async(dispatch)=> {
    try {
        const user = await auth.createUserWithEmailAndPassword(email,password);
        await auth.currentUser.updateProfile({displayName:name});
        database.ref('users/'+user.user.uid).set({name:name?name:email.split("@")[0],email:user.user.email,createdAt:user.user.metadata.creationTime});
        database.ref('profiles/'+user.user.uid).set({uid:user.user.uid,name:name?name:email.split("@")[0],image:"",attended:0,hosted:0,createdAt:user.user.metadata.creationTime});
        dispatch({
            type:SIGNUP_SUCCESS,
            payload: {uid:user.user.uid,email:user.user.email,createdAt:user.user.metadata.creationTime}
        });
        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:{uid:user.user.uid,name:name,image:"",attended:0,hosted:0,createdAt:user.user.metadata.creationTime}
        });
        dispatch(setAlert(`Welcome ${name?name:email.split("@")[0]}`,'info'));
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
        const profile = await (await database.ref('profiles/'+user.user.uid).once('value')).val();
        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:profile
        });   
        dispatch(setAlert(`Welcome ${user.user.displayName?user.user.displayName:user.user.email.split("@")[0]}`,'info'));
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
       console.log(user);
       if(user.additionalUserInfo.isNewUser){
            database.ref('users/'+user.user.uid).set({name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],email:user.user.email,createdAt:user.user.metadata.creationTime});
            database.ref('profiles/'+user.user.uid).set({uid:user.user.uid,name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],image:"",attended:0,hosted:0,createdAt:user.user.metadata.creationTime});
       }
       dispatch({
        type:SIGNIN_SUCCESS,
        payload: {uid:user.user.uid,name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],email:user.user.email,createdAt:user.user.metadata.creationTime}
    });
    
    const profile = await (await database.ref('profiles/'+user.user.uid).once('value')).val();
        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:profile
        });
        dispatch(setAlert(`Welcome ${user.user.displayName?user.user.displayName:user.user.email.split("@")[0]}`,'info'));
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
            database.ref('users/'+user.user.uid).set({name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],email:user.user.email,createdAt:user.user.metadata.creationTime});
            database.ref('profiles/'+user.user.uid).set({uid:user.user.uid,name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],image:"",attended:0,hosted:0,createdAt:user.user.metadata.creationTime});
       }
       dispatch({
        type:SIGNIN_SUCCESS,
        payload: {uid:user.user.uid,name:user.user.displayName?user.user.displayName:user.user.email.split("@")[0],email:user.user.email,createdAt:user.user.metadata.creationTime}
    });
    const profile = await (await database.ref('profiles/'+user.user.uid).once('value')).val();
        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:profile
        });
        dispatch(setAlert(`Welcome ${user.user.displayName?user.user.displayName:user.user.email.split("@")[0]}`,'info'));
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
        console.log('logging out');
        await auth.signOut();
        dispatch({
            type:LOGOUT
        });
    } catch (error) {
        dispatch(setAlert(error.message,'danger'));
        console.log(error);
    }
}