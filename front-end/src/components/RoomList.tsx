const RoomList = () => {
  return (
    <div id="room-lists">
      <ul className="room-list">
        <div className="room-list-name">kskim625의 방</div>
        <div className="room-list-persons">6 / 8</div>
      </ul>
      <ul className="room-list room-full">
        <div className="room-list-name">Dunde의 방</div>
        <div className="room-list-persons-full">6 / 6</div>
      </ul>
    </div>
  );
};

export default RoomList;
