import { memo } from 'react';
import { FiZap } from 'react-icons/fi';
import NavButton from './nav-button';

const GenerateButton = () => {
  return (
    <NavButton
      to="/experiment/generate"
      text="Generate"
      icon={<FiZap className="w-4 h-4" />}
      tooltip="Generate Recipe (Public Disabled)"
      disabled={process.env.NODE_ENV !== 'development'}
    />
  );
};

export default memo(GenerateButton);
