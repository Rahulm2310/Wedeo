import {combineReducers} from 'redux';
import auth from './auth/reducer';
import alert from './alert/reducer';
import meeting from './meeting/reducer';
import messages from './messages/reducer';

const rootReducer = combineReducers({
    auth,
    alert,
    meeting,
    messages
});

export default rootReducer;