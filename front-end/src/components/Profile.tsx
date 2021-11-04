import { useRef, useEffect, useContext } from 'react';
import character from '../images/mainChar2.svg';
import { globalContext } from '../App';

const Profile = () => {
  const profileImage = useRef(null);
  const { user } = useContext(globalContext);
  const userInfo = {
    userId: user.nickname ? user.nickname : user.user_id,
    userPoint: user.nickname ? 0 : user.point,
    userRank: user.nickname ? 'unranked' : 'unknown',
  };
  useEffect(() => {
    if (profileImage.current) profileImage.current.src = character;
  });

  return (
    <div id="profile">
      <img className="profile-character" ref={profileImage}></img>
      <div className="profile-id">{userInfo.userId}</div>
      <div className="profile-point">내 점수 : {userInfo.userPoint}</div>
      <div className="profile-rank">내 등급 : {userInfo.userRank}</div>
    </div>
  );
};

export default Profile;
