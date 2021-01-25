import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import firebase from 'firebase';
import 'firebase/firestore';

import Header from './Header';
import Main from './Main';
import MediaPage from './MediaPage';
import ToastMessage from './ToastMessage';

const Footer = styled.footer`
  width: 100%;
  height: 150px;
  background-color: black;
`;

const firebaseConfig = {
  apiKey: 'AIzaSyD1y5PGwnWyxGk1sYW9BUkNwWx9H_tf8zc',
  authDomain: 'filmo-55c78.firebaseapp.com',
  projectId: 'filmo-55c78',
  storageBucket: 'filmo-55c78.appspot.com',
  messagingSenderId: '327056170566',
  appId: '1:327056170566:web:264dc5ee6e64dd89593447',
  measurementId: 'G-VTX1WCEEC8',
};
firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Main />
          </Route>
          <Route path="/media/:mediaType/:id" component={(props) => <MediaPage {...props} key={window.location.pathname} />} />
        </Switch>
        <Footer />
        <ToastMessage />
      </Router>
    </Provider>
  );
}

export default App;
