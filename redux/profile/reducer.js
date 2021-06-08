import { GET_PROFILE_REQUEST,GET_PROFILE_SUCCESS,GET_PROFILE_FAILURE,DELETE_PROFILE_REQUEST,DELETE_PROFILE_FAILURE,DELETE_PROFILE_SUCCESS, UPDATE_PROFILE_REQUEST,UPDATE_PROFILE_SUCCESS,UPDATE_PROFILE_FAILURE } from "./types";

const initialState = {
    data:null,
    loading:false,
    error:false
}

const profileReducer = (state=initialState,action)=>{
    const {type,payload}=action;
    switch(type){
        case GET_PROFILE_REQUEST:
            return {
                ...state,
                loading:true
            }
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                data:{...state.data,...payload},
                loading:false
            }
        case GET_PROFILE_FAILURE:
            return state;
        case UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading:true
            }
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                data:{...state.data,...payload},
                loading:false
            }
        case UPDATE_PROFILE_FAILURE:
            return state;
        case DELETE_PROFILE_REQUEST:
            return{
                ...state,
                loading:true
            }
        case DELETE_PROFILE_SUCCESS:
            return initialState;
        case DELETE_PROFILE_FAILURE:
            return state;
        default:
            return state;
    }
}
export default profileReducer;