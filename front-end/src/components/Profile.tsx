import { useRef, useEffect } from 'react';
import character from '../images/mainChar2.svg';

type ProfileType = { id: string; point: number; rating: string };

const Profile = ({ id, point, rating }: ProfileType) => {
  const profileImage = useRef(null);

  useEffect(() => {
    if (profileImage.current) profileImage.current.src = character;
  });

  return (
    <div id="profile">
      <img className="profile-character" ref={profileImage}></img>
      <div className="profile-id">{id}</div>
      <div className="profile-point">내 점수 : {point} pt</div>
      <div className="profile-rank">내 등급 : {rating}</div>
    </div>
  );
};

export default Profile;
