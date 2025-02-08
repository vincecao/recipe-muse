import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import './tailwind.css';
import ThemeButton from './component/ThemeButton';
import BackButton from './component/BackButton';
import AboutUsButton from './component/AboutUsButton';
import HomeButton from './component/HomeButton';
import LanguageButton from './component/LanguageButton';
import { useLanguage } from './core/useLanguage';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body className="overflow-hidden">
        <MProvider>
          <InnerApp>{children}</InnerApp>
        </MProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function InnerApp({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const allowHome = pathname !== '/';
  const allowBack = !['/', '/about-us'].includes(pathname);
  const showAboutUs = pathname !== '/about-us';

  return (
    <main className="absolute top-0 left-0 right-0 min-h-screen px-0 pt-16 pb-12 bg-slate-50 dark:bg-slate-900 h-full overflow-auto">
      {allowHome && (
        <Link to="/home" className="absolute top-0 right-0 left-0 text-center font-serif mt-4 text-2xl">
          Recipe Muse
        </Link>
      )}
      <div className="fixed right-4 top-4 flex gap-2 z-20">
        <LanguageButton />
        <ThemeButton />
        {showAboutUs && <AboutUsButton />}
      </div>
      <div className="fixed left-4 top-4 flex gap-2 z-20">
        {allowHome && <HomeButton />}
        {allowBack && <BackButton />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 text-center py-4 text-sm text-gray-600 dark:text-gray-400 z-0">
        <a href="https://github.com/vincecao/recipe-muse" target="_black">
          RecipeMuse
        </a>{' '}
        @2024{' '}
        <a href="https://www.vince-amazing.com/" target="_black">
          vincecao
        </a>
      </div>
      {children}
    </main>
  );
}

function MProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={{
        fontFamily: 'Source Serif 4, serif',
        headings: {
          fontFamily: 'Playfair Display, serif',
          fontWeight: '500',
        },
        colors: {
          brand: [
            '#fff4e6',
            '#ffe8cc',
            '#ffd8a8',
            '#ffc078',
            '#ffa94d',
            '#ff922b',
            '#fd7e14',
            '#f76707',
            '#e8590c',
            '#d9480f',
          ],
        },
      }}
    >
      {children}
    </MantineProvider>
  );
}

export default function App() {
  return <Outlet />;
}
