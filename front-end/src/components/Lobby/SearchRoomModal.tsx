import '../../styles/SearchRoomModal.css';
import React, { useContext, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import setModal from '../../utils/setModal';

const SearchRoomModal = ({ offModal, setFilterWord }: { offModal(): void; setFilterWord: (filterWord: string) => void }) => {
  const [searchWord, setSearchWord] = useState('');
  const setModalState = useSetRecoilState(globalAtom.modal);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    setModal(setModalState, { type, ment });
  };

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const searchRoom = () => {
    if (searchWord === '') {
      popModal('error', '검색어를 입력해주세요.');
    } else {
      setFilterWord(searchWord);
      offModal();
    }
  };

  return (
    <div id="search-room">
      <div className="search-room-header">방 검색하기</div>
      <div className="search-room-name">
        <input className="sh-name sh-input-box" type="text" placeholder="검색할 단어를 입력해주세요 (최대 30자)" onInput={changeTitle}></input>
      </div>
      <div className="search-room-buttons">
        <button className="search-room-do sh-button" onClick={searchRoom}>
          검색하기
        </button>
        <button className="search-room-cancel sh-button" onClick={offModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SearchRoomModal;
