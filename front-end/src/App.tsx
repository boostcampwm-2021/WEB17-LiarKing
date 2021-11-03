import './styles/App.css';
import Main from './components/Main';
import Modal from './components/Modal';
import React, { useState } from 'react';

export const ModalContext = React.createContext(null);

function App() {
  const [modal, setModal] = useState([]);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    const $Modal = <Modal type={type} ment={ment} />;

    setModal([$Modal]);

    setTimeout(() => {
      setModal([]);
    }, 2000);
  };

  return (
    <ModalContext.Provider value={popModal}>
      <Main />
      {modal}
    </ModalContext.Provider>
  );
}

export default App;
