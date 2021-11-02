import './styles/App.css';
import Main from './components/Main';
import Modal from './components/Modal';
import { useState } from 'react';

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
    <>
      <Main popModal={popModal} />
      {modal}
    </>
  );
}

export default App;
