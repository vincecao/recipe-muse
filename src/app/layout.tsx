import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import InnerApp from '~/presentation/components/layout/inner-app';
import ThemeProvider from '~/presentation/components/layout/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Recipe Muse - Daily Menu',
  description: `Today's curated selection of dishes, crafted with care and precision.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="overflow-hidden">
        <ThemeProvider>
          <InnerApp>{children}</InnerApp>
        </ThemeProvider>
      </body>
    </html>
  );
}
