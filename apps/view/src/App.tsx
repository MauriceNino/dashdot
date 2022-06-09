import { FC, useMemo } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from 'styled-components';
import { useColorScheme } from 'use-color-scheme';
import { MainWidgetContainer } from './components/main-widget-container';
import { MobileContextProvider } from './services/mobile';
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

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};

    --ant-primary-color: ${({ theme }) => theme.colors.primary};
    --ant-primary-color-hover: ${({ theme }) => theme.colors.primary};
  }

  #root {
    overflow-x: hidden;
    width: 100%;
    min-height: 100%;

    background: ${({ theme }) =>
      theme.dark ? getDarkGradient(theme) : getLightGradient(theme)};

    transition: background 0.5s ease;
    background-attachment: fixed;
  }

  .ant-switch {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: unset;
  }

  .ant-switch-checked {
    background: var(--ant-primary-color);
  }
`;

export const App: FC = () => {
  const { scheme } = useColorScheme();
  const [darkMode] = useSetting('darkMode', scheme === 'dark');
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <MobileContextProvider>
        <MainWidgetContainer />
      </MobileContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
};
