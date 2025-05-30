import { memo } from 'react';
import { FiZap } from 'react-icons/fi';
import NavButton from './nav-button';

const GenerateButton = () => {
  return (
    <NavButton
      to="/experiment/generate"
      text="Generate"
      icon={<FiZap className="w-4 h-4" />}
      tooltip={{ content: 'Generate Recipe' }}
    />
  );
};

export default memo(GenerateButton);
