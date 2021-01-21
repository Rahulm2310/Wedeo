import '../styles/globals.css';
import "react-datetime/css/react-datetime.css";
import {Provider} from 'react-redux';
import store from '../redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Alert from '../components/Alert';

function MyApp({ Component, pageProps }) {
  return <Provider store={store}>
    <PersistGate persistor={store._persistor} loading={null}>
      <Alert/>
    <Component {...pageProps} />
    </PersistGate>
  </Provider>
}

export default MyApp
