import { CpuLoad, RamLoad, StorageLoad } from 'dashdot-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  default as styled,
  DefaultTheme,
  ThemeProvider,
} from 'styled-components';
import { useColorScheme } from 'use-color-scheme';
import { useServerInfo } from './api/os-info';
import GlassPane from './components/glass-pane';
import { BACKEND_URL } from './config/config';
import { MobileContextProvider, useIsMobile } from './services/mobile';
import { useSetting } from './services/settings';
import { darkTheme, lightTheme } from './theme/theme';
import CpuWidget from './widgets/cpu';
import RamWidget from './widgets/ram';
import ServerWidget from './widgets/server';
import StorageWidget from './widgets/storage';

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

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
  padding-bottom: 5vh;
  background: ${({ theme }) =>
    theme.dark ? getDarkGradient(theme) : getLightGradient(theme)};

  transition: background 0.5s ease;

  .ant-switch {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: unset;
  }

  .ant-switch-checked {
    background: var(--ant-primary-color);
  }
`;

const FlexContainer = styled.div<{ mobile: boolean }>`
  width: ${({ mobile }) => (mobile ? '96vw' : '88vw')};
  min-height: ${({ mobile }) => (mobile ? '96vh' : '86vh')};
  margin: ${({ mobile }) => (mobile ? '2vh' : '7vh')} auto 0 auto;

  display: flex;
  flex-flow: row wrap;
  column-gap: 40px;
  row-gap: 50px;
`;

function App() {
  const { scheme } = useColorScheme();
  const [darkMode] = useSetting('darkMode', scheme === 'dark');
  const isMobile = useIsMobile();

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);
  const antTheme = useMemo(
    () =>
      ({
        '--ant-primary-color': theme.colors.primary,
        '--ant-primary-color-hover': theme.colors.primary,
      } as React.CSSProperties),
    [theme]
  );

  const serverInfo = useServerInfo();
  const osData = serverInfo.data?.os;
  const cpuData = serverInfo.data?.cpu;
  const ramData = serverInfo.data?.ram;
  const storageData = serverInfo.data?.storage;
  const config = serverInfo.data?.config;

  const [cpuLoad, setCpuLoad] = useState<CpuLoad[]>([]);
  const [ramLoad, setRamLoad] = useState<RamLoad[]>([]);
  const [storageLoad, setStorageLoad] = useState<StorageLoad>();
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('cpu-load', data => {
      setCpuLoad(oldData => {
        if (oldData.length >= (configRef.current?.cpu_shown_datapoints ?? 0)) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on('ram-load', data => {
      setRamLoad(oldData => {
        if (oldData.length >= (configRef.current?.ram_shown_datapoints ?? 0)) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on('storage-load', data => {
      setStorageLoad(data);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MobileContextProvider>
        <Container style={antTheme}>
          <FlexContainer mobile={isMobile}>
            {config?.os_widget_enable && (
              <GlassPane
                grow={config?.os_widget_grow}
                enableTilt={config?.enable_tilt}
              >
                <ServerWidget
                  loading={serverInfo.loading}
                  data={osData}
                  config={config}
                />
              </GlassPane>
            )}
            {config?.cpu_widget_enable && (
              <GlassPane
                grow={config?.cpu_widget_grow}
                enableTilt={config?.enable_tilt}
              >
                <CpuWidget
                  loading={serverInfo.loading}
                  data={cpuData}
                  load={cpuLoad}
                  config={config}
                />
              </GlassPane>
            )}
            {config?.ram_widget_enable && (
              <GlassPane
                grow={config?.ram_widget_grow}
                enableTilt={config?.enable_tilt}
              >
                <RamWidget
                  loading={serverInfo.loading}
                  data={ramData}
                  load={ramLoad}
                  config={config}
                />
              </GlassPane>
            )}
            {config?.storage_widget_enable && (
              <GlassPane
                grow={config?.storage_widget_grow}
                enableTilt={config?.enable_tilt}
              >
                <StorageWidget
                  loading={serverInfo.loading}
                  data={storageData}
                  load={storageLoad}
                  config={config}
                />
              </GlassPane>
            )}
          </FlexContainer>
        </Container>
      </MobileContextProvider>
    </ThemeProvider>
  );
}

export default App;
