import { selector } from 'recoil';
import Modal, { modalPropsType } from '../components/public/Modal';
import globalAtom from './globalAtom';

const globalSelector = {
  popModal: selector<any>({
    key: 'popModal',
    get: ({ get }) => get(globalAtom.modal),
    set: ({ set }, modalprops: modalPropsType) => {
      console.log(globalAtom.modal);
      set(globalAtom.modal, <Modal modalProps={modalprops} />);
    },
  }),
};

export default globalSelector;
