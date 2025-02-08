import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { Lang } from "./type";

export function useLanguage() {
  const data = useRouteLoaderData<{ language: Lang }>("root");
  const language = data?.language || "en";

  const fetcher = useFetcher();
  const setLanguage = (newLanguage: string) => {
    fetcher.submit({ language: newLanguage }, { method: "post", action: "/api/language" });
  };

  return { language, setLanguage };
}
