export function useAppInfo(): {
  appName: string;
  appNameCapital: string;
} {
  const appName = "Cyclometer";
  const appNameCapital = appName.toUpperCase();

  return {
    appName,
    appNameCapital,
  };
}
