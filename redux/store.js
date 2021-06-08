import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import {persistReducer,persistStore} from 'redux-persist';

const isClient = typeof window!=undefined;
let store;
const middlewares=[thunk];
let composeEnhancers = compose;

if(isClient){
    if(typeof window!='undefined'){
        composeEnhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||compose;
    }
    const { persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;
    const persistConfig = {
        key: 'root',
        storage
      };
    store = createStore(persistReducer(persistConfig,rootReducer),{},composeEnhancers(applyMiddleware(...middlewares)));
    store._persistor=persistStore(store);
}else{
    store = createStore(rootReducer,{},composeEnhancers(applyMiddleware(...middlewares)));
}

export default store;
// const store = createStore(rootReducer);
// export const persistor = persistStore(store);
