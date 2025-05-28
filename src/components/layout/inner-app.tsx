'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AboutUsButton from '../ui/navigation/about-us-button';
import BackButton from '../ui/navigation/back-button';
import HomeButton from '../ui/navigation/home-button';
import LanguageButton from '../ui/navigation/language-button';
import ThemeButton from '../ui/navigation/theme-button';
import RefreshButton from '../ui/navigation/refresh-button';
import GenerateButton from '../ui/navigation/generate-button';
import ChatButton from '../ui/navigation/chat-button';

export default function InnerApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowHome = pathname !== '/';
  const allowBack = pathname ? !['/menu', '/about-us'].includes(pathname) : true;
  const allowRefresh = pathname ? pathname.startsWith('/menu') : false;
  const showAboutUs = pathname !== '/about-us';

  return (
    <main className="absolute top-0 left-0 right-0 min-h-screen px-0 pt-16 pb-12 bg-slate-50 dark:bg-slate-900 h-full overflow-auto">
      {allowHome && (
        <Link
          href="/home"
          className="absolute top-0 right-0 left-0 text-center font-serif mt-4 text-2xl dark:text-white text-black"
        >
          Recipe Muse
        </Link>
      )}
      <div className="fixed right-4 md:right-6 top-4 flex gap-2 z-20">
        <LanguageButton />
        <ThemeButton />
        {showAboutUs && <AboutUsButton />}
      </div>
      <div className="fixed left-4 md:left-6 top-4 flex gap-2 z-20">
        {allowHome && <HomeButton />}
        {allowBack && <BackButton />}
        {allowRefresh && <RefreshButton />}
        <GenerateButton />
      </div>
      <div className="fixed right-4 md:right-6 bottom-4 flex gap-2 z-20">
        <ChatButton />
      </div>
      <div className="fixed bottom-0 left-0 right-0 text-center py-4 text-sm text-gray-600 dark:text-gray-400 z-0">
        <a href="https://github.com/vincecao/recipe-muse" target="_black">
          Recipe Muse{' '}
        </a>
        @2025{' '}
        <a href="https://www.vince-amazing.com/" target="_black">
          vincecao
        </a>
      </div>
      {children}
    </main>
  );
}
