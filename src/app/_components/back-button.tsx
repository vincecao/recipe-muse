'use client';

import { memo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import NavButton from './nav-button';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  return (
    <NavButton
      type="button"
      onClick={() => router.back()}
      text="Back"
      icon={<FiArrowLeft className="w-4 h-4" />}
      tooltip={{ content: 'Back' }}
    />
  );
};

export default memo(BackButton);
