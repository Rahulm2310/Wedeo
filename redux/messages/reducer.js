import { CLEAR_MESSAGES, UPDATE_MESSAGES,UPDATE_USERS,REMOVE_USER,CLEAR_USERS } from "./actions";

const initialState = {
    messages:[],
    users:[]
}

const messageReducer = (state=initialState,action)=>{
    const {type,payload}=action;

    switch(type){
    case UPDATE_MESSAGES:
        return {
            ...state,
            messages:[...state.messages,payload]
        }
    case CLEAR_MESSAGES:
        return {
            ...state,
            messages:[]
        }
    case UPDATE_USERS:
        return {
            ...state,
            users:[payload,...state.users]
        }
    case REMOVE_USER:
        return {
            ...state,
            users:state.users.filter(user=>user.uid!=payload.uid)
        }
    case CLEAR_USERS:
        return {
            users:[],
            messages:[]
        }
    default:
        return state
    }
}
export default messageReducer;