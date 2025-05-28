'use client';
import { memo, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import NavButton from './nav-button';
import { usePathname, useRouter } from 'next/navigation';

const RefreshButton = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);

    try {
      // Call server action through API route
      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ pathname }),
      });

      // Force client-side refresh
      router.refresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavButton
      text="Refresh"
      icon={<FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
      onClick={handleRefresh}
      tooltip={{ content: 'Cache Free Refresh' }}
    />
  );
};

export default memo(RefreshButton);
