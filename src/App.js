import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import MoviePage from './MoviePage';
import TVPage from './TVPage';

const Footer = styled.footer`
  width: 100%;
  height: 150px;
  background-color: black;
`;

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/movie/:id" component={MoviePage} />
        <Route path="/tv/:id" component={TVPage} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
