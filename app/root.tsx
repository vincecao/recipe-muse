import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { MantineProvider, ColorSchemeScript, useMantineColorScheme } from "@mantine/core";

import "./tailwind.css";
import ThemeButton from "./component/ThemeButton";
import BackButton from "./component/BackButton";

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
  // const { colorScheme } = useMantineColorScheme();
  // const isDark = colorScheme === "dark";
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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const { pathname } = useLocation();
  const allowBack = pathname !== "/";
  return (
    <>
      {children}
      <ThemeButton />
      {allowBack && <BackButton />}
      <div className={`fixed z-0 bottom-0 left-0 right-0 text-center py-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>@2024 vincecao</div>
    </>
  );
}

function MProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={{
        fontFamily: "Source Serif 4, serif",
        headings: {
          fontFamily: "Playfair Display, serif",
          fontWeight: "500",
        },
        colors: {
          brand: ["#fff4e6", "#ffe8cc", "#ffd8a8", "#ffc078", "#ffa94d", "#ff922b", "#fd7e14", "#f76707", "#e8590c", "#d9480f"],
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
