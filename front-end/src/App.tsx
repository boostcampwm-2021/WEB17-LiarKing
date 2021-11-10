import './styles/App.css';
import Main from './components/pages/Main';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/Game';
import Error from './components/pages/Error';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import io from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import globalAtom from './recoilStore/globalAtom';

export const globalContext = React.createContext(null);

const global = { roomData: { selectedRoomTitle: '' }, popModal: {}, user: {}, socket: io(process.env.REAC_APP_SOCKET_HOST, { path: '/socket' }) };

function App() {
  const modal = useRecoilValue(globalAtom.modal);

  return (
    <globalContext.Provider value={global}>
      <Router>
        <Route
          render={({ location }): any => {
            return (
              <TransitionGroup className="transition-group">
                <CSSTransition key={location.pathname} timeout={300} classNames="page-slider">
                  <Switch location={location}>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/lobby" component={Lobby} />
                    <Route exact path="/game" component={Game} />
                    <Route path="/*" component={Error} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        ></Route>
      </Router>
      {modal}
    </globalContext.Provider>
  );
}

export default App;
