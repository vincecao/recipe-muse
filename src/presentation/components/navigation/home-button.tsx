import { memo } from 'react';
import { FiHome } from 'react-icons/fi';
import NavButton from './nav-button';

const HomeButton = () => {
  return (
    <NavButton
      to="/home"
      text="Home"
      icon={<FiHome className="w-4 h-4" />}
      tooltip={{ content: 'Home', placement: 'right' }}
    />
  );
};

export default memo(HomeButton);
