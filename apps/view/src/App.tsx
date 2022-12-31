import { ConfigProvider } from 'antd';
import { FC, useMemo } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from 'styled-components';
import { useColorScheme } from 'use-color-scheme';
import { MainWidgetContainer } from './components/main-widget-container';
import { SingleWidgetChart } from './components/single-widget-chart';
import { MobileContextProvider } from './services/mobile';
import { useQuery } from './services/query-params';
import { useSetting } from './services/settings';
import { darkTheme, lightTheme } from './theme/theme';

const getLightGradient = (theme: DefaultTheme) => `
radial-gradient(
  circle at 10% 10%,
  ${theme.colors.secondary}66 10%,
  transparent 10.2%
),
radial-gradient(circle at 10% 10%, #ffffff 10%, transparent 10.2%),
radial-gradient(
  circle at 90% 85%,
  ${theme.colors.primary}66 20%,
  transparent 20.2%
),
radial-gradient(circle at 90% 85%, white 20%, transparent 20.2%),
linear-gradient(
  200deg,
  ${theme.colors.primary} 0%,
  ${theme.colors.secondary} 60%
)`;

const getDarkGradient = (theme: DefaultTheme) => `
radial-gradient(
  circle at 10% 10%,
  ${theme.colors.primary} 10%,
  transparent 10.5%
),
radial-gradient(
  circle at 110% 90%,
  ${theme.colors.secondary} 30%,
  transparent 30.5%
),
linear-gradient(
  290deg,
  ${theme.colors.primary} 0%,
  ${theme.colors.secondary} 40%
)`;

const GlobalStyle = createGlobalStyle<{ noBg: boolean }>`
  body {
    background-color: ${({ theme, noBg }) =>
      noBg ? 'transparent' : theme.colors.background};
  }

  #root {
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;

    background: ${({ theme, noBg }) =>
      noBg
        ? 'transparent'
        : theme.dark
        ? getDarkGradient(theme)
        : getLightGradient(theme)};

    transition: background 0.5s ease;
    background-attachment: fixed;
  }

  .ant-switch {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: unset;
  }

  .ant-btn {
    background: ${({ theme }) => theme.colors.background};
    border: none;
  }
`;

const overrideColor = (
  colors: typeof darkTheme['colors'],
  query: ReturnType<typeof useQuery>
) => {
  if (query.isSingleGraphMode) {
    if (query.overrideThemeColor) {
      colors.cpuPrimary = `#${query.overrideThemeColor}`;
      colors.storagePrimary = `#${query.overrideThemeColor}`;
      colors.ramPrimary = `#${query.overrideThemeColor}`;
      colors.networkPrimary = `#${query.overrideThemeColor}`;
      colors.gpuPrimary = `#${query.overrideThemeColor}`;
      colors.primary = `#${query.overrideThemeColor}`;
    }

    if (query.overrideThemeSurface) {
      colors.surface = `#${query.overrideThemeSurface}`;
    }
  }
};

export const App: FC = () => {
  const { scheme } = useColorScheme();
  const [darkMode] = useSetting('darkMode', scheme === 'dark');
  const query = useQuery();

  const theme = useMemo(() => {
    const baseTheme = darkMode ? darkTheme : lightTheme;

    if (query.isSingleGraphMode) {
      const queryTheme = query.overrideTheme
        ? query.overrideTheme === 'dark'
          ? darkTheme
          : lightTheme
        : baseTheme;
      overrideColor(queryTheme.colors, query);

      return queryTheme;
    }

    return baseTheme;
  }, [darkMode, query]);

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.colors.primary,
            colorPrimaryHover: theme.colors.primary,
          },
        }}
      >
        <MobileContextProvider>
          {query.isSingleGraphMode ? (
            <SingleWidgetChart />
          ) : (
            <MainWidgetContainer />
          )}
        </MobileContextProvider>
      </ConfigProvider>
      <GlobalStyle noBg={query.isSingleGraphMode} />
    </ThemeProvider>
  );
};
