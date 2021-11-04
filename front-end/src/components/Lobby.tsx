import '../styles/Lobby.css';
import RoomList from './RoomList';
import Profile from './Profile';
import LobbyButtons from './LobbyButtons';
import React, { useContext } from 'react';
import { globalContext } from '../App';

const createProfile = (user: { user_id?: string; point?: number; nickname?: string }): { id: string; point: number; rating: string } => {
  if (!user.user_id) {
    return { id: user.nickname, point: 0, rating: 'Guest' };
  }

  return { id: user.user_id, point: user.point, rating: ratingInfo(user.point) };
};

const ratingInfo = (point: number): string => {
  if (point < 100) return 'Unranked';
  if (point >= 100 && point < 200) return 'Bronze';
  if (point >= 200 && point < 300) return 'Silver';
  if (point >= 300 && point < 400) return 'Gold';
  if (point >= 400) return 'Diamond';
};

const Lobby = () => {
  const { user } = useContext(globalContext);

  const { id, point, rating } = createProfile(user);

  return (
    <div id="lobby">
      <div className="lobby-center-items">
        <div className="lobby-header">Liar Game</div>
        <div className="lobby-rooms">
          <RoomList />
        </div>
      </div>
      <div className="lobby-right-items">
        <Profile id={id} point={point} rating={rating} />
        <LobbyButtons />
      </div>
    </div>
  );
};

export default React.memo(Lobby);
