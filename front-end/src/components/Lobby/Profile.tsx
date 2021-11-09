import { useRef, useEffect, useState } from 'react';
import character from '../../images/mainChar2.svg';
import { getUserData } from '../../utils/getDataUtil';

const Profile = () => {
  const profileImage = useRef(null);

  const [user, setUser]: [{ user_id: string; point: number; rank: string }, any] = useState({ user_id: 'loading', point: 0, rank: 'loading' });

  useEffect(() => {
    getUserData(setUser);

    if (profileImage.current) profileImage.current.src = character;
  }, []);

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
