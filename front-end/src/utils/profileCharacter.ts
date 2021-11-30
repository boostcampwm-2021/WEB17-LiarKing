import defaultChar from '../images/mainChar2.svg';
import bronzeChar from '../images/thief.svg';
import silverChar from '../images/soldier.svg';
import goldChar from '../images/dj.svg';

const profileCharacter = (rank: string) => {
  switch (rank) {
    case 'Bronze':
      return bronzeChar;
    case 'Silver':
      return silverChar;
    case 'Gold':
      return goldChar;
    default:
      return defaultChar;
  }
};

export default profileCharacter;
