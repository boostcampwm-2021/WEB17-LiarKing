import React, { useEffect } from 'react';
import { useState } from 'react';
import '../../styles/CreateRankModal.css';

const CreateRankModal = ({ offModal }: { offModal(): void }) => {
  const [ranks, setRanks] = useState([]);

  type ranksType = {
    user_id: string;
    point: number;
    ranking: string;
  };

  interface icolors {
    [key: string]: string;
  }
  const colors: icolors = {
    1: 'red',
    2: 'blue',
    3: 'orange',
  };

  useEffect(() => {
    const getRanks = async () => {
      const _ranks: any = await fetch('/api/users/ranks');
      const ranks: any = await _ranks.json();
      setRanks(ranks);
    };

    getRanks();
  }, []);

  return (
    <div id="create-rank">
      <div className="create-rank-header">랭 킹</div>
      {ranks.map((rank: ranksType) => {
        return (
          <div className="create-rank-content" key={rank['ranking']}>
            <span className="create-rank-rank">{rank['ranking']}위</span>
            <span className="create-rank-name">{rank['user_id']}</span>
            {colors[rank['ranking']] ? (
              <span className="create-rank-point" style={{ color: colors[rank['ranking']] }}>
                {rank['point']}pt
              </span>
            ) : (
              <span className="create-rank-point">{rank['point']}pt</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreateRankModal;
