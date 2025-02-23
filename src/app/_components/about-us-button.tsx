import { memo } from 'react';
import { FiInfo } from 'react-icons/fi';
import NavButton from './nav-button';

const AboutUsButton = () => {
  return <NavButton to="/about-us" text="About Us" icon={<FiInfo className="w-4 h-4" />} tooltip="About-us" />;
};

export default memo(AboutUsButton);
