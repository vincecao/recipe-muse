import { useNavigate } from '@remix-run/react';
import { memo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import NavButton from './NavButton';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <NavButton type="button" onClick={() => navigate(-1)} text="Back" icon={<FiArrowLeft className="w-4 h-4" />} />
  );
};

export default memo(BackButton);
