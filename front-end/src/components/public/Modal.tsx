import '../styles/Modal.css';

type modalParam = { type: 'alert' | 'warning' | 'error'; ment: string };

enum translate {
  'alert' = '알림',
  'warning' = '경고',
  'error' = '오류',
}

const Modal = ({ type, ment }: modalParam) => {
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
