import '../../styles/CreateRoomModal.css';
import { useContext, useState } from 'react';
import { globalContext } from '../../App';

const SearchRoomModal = ({ offModal, setFilterWord }: { offModal(): void; setFilterWord: any }) => {
  const { popModal }: { popModal: any } = useContext(globalContext);
  const [searchWord, setSearchWord] = useState('');

  const changeTitle = (e: any) => {
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
    <div id="create-room">
      <div className="create-room-header">방 검색하기</div>
      <div className="create-room-name">
        <input className="cr-name cr-input-box" type="text" placeholder="검색할 단어를 입력해주세요 (최대 30자)" onInput={changeTitle}></input>
      </div>

      <div className="create-room-buttons">
        <button className="create-room-do cr-button" onClick={searchRoom}>
          검색하기
        </button>
        <button className="create-room-cancel cr-button" onClick={offModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SearchRoomModal;
