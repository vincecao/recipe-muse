import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";

import "./tailwind.css";
import ThemeButton from "./component/ThemeButton";
import BackButton from "./component/BackButton";
import { useIsDark } from "./core/useIsDark";

import cn from "classnames";
import AboutUsButton from "./component/AboutUsButton";
import HomeButton from "./component/HomeButton";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
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
  const isDark = useIsDark();
  const { pathname } = useLocation();
  const allowHome = pathname !== "/";
  const allowBack = !["/", "/about-us"].includes(pathname);
  const showAboutUs = pathname !== "/about-us";

  return (
    <>
      {children}
      <div className="fixed right-4 top-4 flex gap-2">
        <ThemeButton />
        {showAboutUs && <AboutUsButton />}
      </div>
      <div className="fixed left-4 top-4 flex gap-2">
        {allowHome && <HomeButton />}
        {allowBack && <BackButton />}
      </div>
      <div
        className={cn("fixed z-0 bottom-0 left-0 right-0 text-center py-4 text-sm", {
          "text-gray-400": isDark,
          "text-gray-600": !isDark,
        })}
      >
        <a href="https://github.com/vincecao/meal-muse" target="_black">
          MealMuse
        </a>{" "}
        @2024{" "}
        <a href="https://www.vince-amazing.com/" target="_black">
          vincecao
        </a>
      </div>
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
