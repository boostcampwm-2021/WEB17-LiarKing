import { selector } from 'recoil';
import Modal, { modalPropsType } from '../components/public/Modal';
import globalAtom from './globalAtom';

const globalSelector = {
  popModal: selector({
    key: 'popModal',
    get: ({ get }) => {
      return get(globalAtom.modal);
    },
    set: ({ set }, modalprops: modalPropsType | any) => {
      set(globalAtom.modal, <Modal modalProps={modalprops} />);
    },
  }),
};

export default globalSelector;
