import {combineReducers} from 'redux';
import auth from './auth/reducer';
import alert from './alert/reducer';
import meeting from './meeting/reducer';
import messages from './messages/reducer';
import theme from './theme/reducer';
import profile from './profile/reducer';

const rootReducer = combineReducers({
    auth,
    alert,
    meeting,
    messages,
    theme,
    profile
});

export default rootReducer;