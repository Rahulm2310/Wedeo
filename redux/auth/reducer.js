import { logoutUser } from './actions';
import {SIGNIN_SUCCESS,SIGNUP_SUCCESS,AUTH_ERROR,LOGOUT} from './types';

const initialState = {
    isAuthenticated:false,
    loading:false,
    user:null,
    error:null
};

const userReducer = (state=initialState,{payload,type})=>{
    switch(type){
        case SIGNUP_SUCCESS:
        case SIGNIN_SUCCESS:
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload,
                error:null
            }
        
        case AUTH_ERROR:
            return {
                ...state,
                isAuthenticated:false,
                loading:false,
                error:payload,
                user:null
            }
        case LOGOUT:
            return {
                ...state,
                isAuthenticated:false,
                loading:false,
                error:null,
                user:null
            }
        default:
            return state;
    }
}

export default userReducer;