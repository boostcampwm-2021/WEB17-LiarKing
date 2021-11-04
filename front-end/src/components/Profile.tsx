import React, { useRef, useEffect } from 'react';
import character from '../images/mainChar2.svg';

const Profile = () => {
  const profileImage = useRef(null);
  useEffect(() => {
    if (profileImage.current) profileImage.current.src = character;
  });

  return (
    <div id="profile">
      <img className="profile-character" ref={profileImage}></img>
      <div className="profile-id">kskim625</div>
      <div className="profile-point">내 점수 : 500 pt</div>
      <div className="profile-rank">내 등급 : Gold</div>
    </div>
  );
};

export default Profile;
