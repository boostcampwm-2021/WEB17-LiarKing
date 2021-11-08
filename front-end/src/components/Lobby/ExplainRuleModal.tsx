import '../../styles/ExplainRuleModal.css';
import { useState } from 'react';
import leftArrow from '../../images/leftArrow.svg';
import rightArrow from '../../images/rightArrow.svg';
import ruleOne from '../../images/ruleOne.svg';
import ruletwo from '../../images/ruleTwo.svg';
import ruleThree from '../../images/ruleThree.svg';
import ruleFour from '../../images/ruleFour.svg';
import ruleFive from '../../images/mainChar1.svg';
import ruleSix from '../../images/mainChar2.svg';

interface ruleInterface {
  [prop: string]: string;
}

interface ruleImageInterface {
  [prop: string]: string;
}

const rules: ruleInterface = {
  1: '1. 제시어 카테고리를 선택합니다.',
  2: '2. 제시어를 확인합니다. 이 때, 라이어에게는 제시어가 공개되지 않습니다.',
  3: '3. 한 명씩 제시어에 대해 설명합니다. 일반 사람들은 라이어가 제시어를 알아채지 못하게, 라이어는 정체를 들키지 않게 거짓말로 설명합니다.',
  4: '4. 총 라운드 수 만큼 설명한 뒤, 제한 시간 이내에 라이어가 누구인지 투표합니다.',
  5: '5. 라이어가 아닌 사람이 뽑히거나 라이어가 마지막에 제시어를 맞히면 라이어의 승리입니다.',
  6: '6. 라이어가 제시어를 맞히지 못할 경우 일반 플레이어의 승리입니다.',
};

const ruleImages: ruleImageInterface = {
  1: ruleOne,
  2: ruletwo,
  3: ruleThree,
  4: ruleFour,
  5: ruleFive,
  6: ruleSix,
};

const ExplainRuleModal = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const MAX_PAGE_LENGTH = 6;

  const increasePage = () => {
    if (pageNumber < MAX_PAGE_LENGTH) {
      setPageNumber(pageNumber + 1);
    }
  };

  const decreasePage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div id="create-room">
      <div className="explain-rule-explanation">{rules[String(pageNumber)]}</div>
      <img className="explain-rule-image" src={ruleImages[String(pageNumber)]} />
      <div className="room-list-buttons">
        <img className="room-list-arrows" src={leftArrow} onClick={decreasePage}></img>
        <div className="room-list-numbers">{pageNumber + ' / ' + MAX_PAGE_LENGTH}</div>
        <img className="room-list-arrows" src={rightArrow} onClick={increasePage}></img>
      </div>
    </div>
  );
};

export default ExplainRuleModal;
