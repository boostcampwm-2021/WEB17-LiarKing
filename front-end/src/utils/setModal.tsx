import Modal from '../components/public/Modal';

/**
 * 모달을 띄워주는 함수
 * @param setState setModal 함수
 * @param modalProps 들어갈 Props인자
 * @returns
 */
const setModal = (setState: (value: any) => any, modalProps: { type: 'alert' | 'warning' | 'error'; ment: string }) => {
  setState(<Modal modalProps={modalProps} key={0} />);

  setTimeout(() => {
    setState(<></>);
  }, 2000);
};

export default setModal;
