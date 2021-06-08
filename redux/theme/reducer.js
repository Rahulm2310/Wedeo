import { TOGGLE_THEME } from "./actions";

const initialState = {
    isDarkMode:false
}

const themeReducer = (state=initialState,action)=>{
    const {type}=action;

    switch(type){
        case TOGGLE_THEME:
            return {
                isDarkMode:!state.isDarkMode
            }
        default:
            return state;
    }
}

export default themeReducer;