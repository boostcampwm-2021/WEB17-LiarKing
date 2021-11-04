import './styles/App.css';
import Main from './components/Main';
import Lobby from './components/Lobby';
import Modal from './components/Modal';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const globalContext = React.createContext(null);

const global = { popModal: {}, user: {} };

function App() {
  const [modal, setModal] = useState([]);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    const $Modal = <Modal type={type} ment={ment} key={0} />;

    setModal([$Modal]);

    setTimeout(() => {
      setModal([]);
    }, 2000);
  };

  global['popModal'] = popModal;

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
                    <Route path="/lobby" component={Lobby} />
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
