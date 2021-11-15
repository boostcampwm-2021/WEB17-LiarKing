import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import '../../styles/Modal.css';

export type modalPropsType = { type: 'alert' | 'warning' | 'error'; ment: string };

enum translate {
  'alert' = '알림',
  'warning' = '경고',
  'error' = '오류',
}

const Modal = ({ modalProps }: { modalProps: modalPropsType | any }) => {
  const { type, ment }: modalPropsType = modalProps;
  const setModal = useSetRecoilState(globalAtom.modal);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setModal(<></>);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="modal-outter">
      <div id="modal">
        <div className="modal-title">
          <div className={`modal-img-common modal-${type}-img`} />
          <span className="modal-title-name">{translate[type]}</span>
        </div>
        <div className="modal-content">{ment}</div>
      </div>
    </section>
  );
};

export default Modal;
