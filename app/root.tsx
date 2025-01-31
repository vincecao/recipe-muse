import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useState } from "react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(preferredColorScheme);

  const toggleColorScheme = (value?: 'light' | 'dark') => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="light"
          colorScheme={colorScheme}
          theme={{
            fontFamily: 'Source Serif 4, serif',
            headings: { 
              fontFamily: 'Playfair Display, serif',
              fontWeight: '500'
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
                '#d9480f'
              ],
            },
          }}
        >
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}