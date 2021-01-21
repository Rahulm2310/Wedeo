import { CREATE_MEET, MEET_ERROR,CREATED_MEET,UPDATE_MEET,DELETE_MEET } from "./types";

const initialState = {
    meetings:[],
    loading:false,
    error:null
}

const meetingReducer = (state=initialState,action)=>{
    const {type,payload}=action;
    switch(type){
        case CREATE_MEET:
            return {
                ...state,
                loading:true
            }
        case CREATED_MEET:
            return {
                ...state,
                meetings:[...state.meetings,payload],
                loading:false
            }
        case UPDATE_MEET:
            return {
                ...state,
                meetings:state.meetings.map(m=>m.id!=payload.id?m:payload),
                loading:false
            }
        case DELETE_MEET:
            return {
                ...state,
                meetings:state.meetings.filter(m=>m.id!=payload),
                loading:false
            }
        case MEET_ERROR:
            return {
                ...state,
                loading:false,
                error:payload
            }
        default :
            return state
    }
}

export default meetingReducer;