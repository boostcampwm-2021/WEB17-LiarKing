import { useRef } from 'react';
import { getUserData } from '../../utils/getDataUtil';
import { useRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import socketUtil, { socket } from '../../utils/socketUtil';
import profileCharacter from '../../utils/profileCharacter';

const Profile = () => {
  const profileImage = useRef(null);
  const [user, setUser] = useRecoilState(globalAtom.user);

  if (!user.user_id || user.socketId !== socket.id) getUserData(setUser, socketUtil, user.socketId !== socket.id);

  if (profileImage.current) {
    profileImage.current.src = profileCharacter(user.rank);
  }

  return (
    <div id="profile">
      <img className="profile-character" ref={profileImage} alt={'profile-character'}></img>
      <div className="profile-id">{user.user_id}</div>
      <div className="profile-point">내 점수 : {user.point}</div>
      <div className="profile-rank">내 등급 : {user.rank}</div>
    </div>
  );
};

export default Profile;
