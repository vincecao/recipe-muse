import { useMantineColorScheme } from "@mantine/core";

export function useIsDark() {
  const { colorScheme } = useMantineColorScheme();
  return colorScheme === "dark";
}
