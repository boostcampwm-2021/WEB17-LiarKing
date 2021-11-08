import React, { useEffect } from 'react';
import { useState } from 'react';
import '../../styles/CreateRankModal.css';

const CreateRankModal = ({ offModal }: { offModal(): void }) => {
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    const getRanks = async () => {
      const ranks: any = await fetch('/users/rank');
      setRanks(ranks);
    };

    getRanks();
  }, []);

  return (
    <div id="create-rank">
      <div className="create-rank-header">랭 킹</div>
      <div className="create-rank-content">
        <span className="create-rank-rank">1위</span>
        <span className="create-rank-name">kskim625</span>
        <span className="create-rank-point">625pt</span>
      </div>
      <div className="create-rank-content">
        <span className="create-rank-rank">1위</span>
        <span className="create-rank-name">kskim625</span>
        <span className="create-rank-point">625pt</span>
      </div>
      <div className="create-rank-content">
        <span className="create-rank-rank">1위</span>
        <span className="create-rank-name">kskim625</span>
        <span className="create-rank-point">625pt</span>
      </div>
      <div className="create-rank-content">
        <span className="create-rank-rank">1위</span>
        <span className="create-rank-name">kskim625</span>
        <span className="create-rank-point">625pt</span>
      </div>
      <div className="create-rank-content">
        <span className="create-rank-rank">1위</span>
        <span className="create-rank-name">kskim625</span>
        <span className="create-rank-point">625pt</span>
      </div>
    </div>
  );
};

export default CreateRankModal;
