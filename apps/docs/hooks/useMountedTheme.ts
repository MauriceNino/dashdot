import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useMountedTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? resolvedTheme : 'dark';
};
