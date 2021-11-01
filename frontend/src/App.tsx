import { CpuLoad, RamLoad, StorageLoad } from "dashdot-shared";
import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import {
  default as styled,
  DefaultTheme,
  ThemeProvider,
} from "styled-components";
import { useColorScheme } from "use-color-scheme";
import { useOsInfo } from "./api/os-info";
import GlassPane from "./components/glass-pane";
import { BACKEND_URL } from "./config/config";
import { useSetting } from "./services/settings";
import { darkTheme, lightTheme } from "./theme/theme";
import CpuWidget from "./widgets/cpu";
import RamWidget from "./widgets/ram";
import ServerWidget from "./widgets/server";
import StorageWidget from "./widgets/storage";

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
`;

const FlexContainer = styled.div`
  width: 90vw;
  min-height: 90vh;
  margin: 5vh auto 0 auto;

  display: flex;
  flex-flow: row wrap;
`;

function App() {
  const { scheme } = useColorScheme();
  const [darkMode] = useSetting("darkMode", scheme === "dark");

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);
  const antTheme = useMemo(
    () =>
      ({
        "--ant-primary-color": theme.colors.primary,
        "--ant-primary-color-hover": theme.colors.primary,
      } as React.CSSProperties),
    [theme]
  );

  const osInfo = useOsInfo();

  const [cpuLoad, setCpuLoad] = useState<CpuLoad[]>([]);
  const [ramLoad, setRamLoad] = useState<RamLoad[]>([]);
  const [storageLoad, setStorageLoad] = useState<StorageLoad>();

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on("cpu-load", (data) => {
      setCpuLoad((oldData) => {
        if (oldData.length >= 20) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on("ram-load", (data) => {
      setRamLoad((oldData) => {
        if (oldData.length >= 20) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on("storage-load", (data) => {
      setStorageLoad(data);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container style={antTheme}>
        <FlexContainer>
          <GlassPane grow={1}>
            <ServerWidget {...osInfo.data?.os} />
          </GlassPane>
          <GlassPane grow={2}>
            <CpuWidget {...osInfo.data?.cpu} load={cpuLoad} />
          </GlassPane>
          <GlassPane grow={1.5}>
            <RamWidget {...osInfo.data?.ram} load={ramLoad} />
          </GlassPane>
          <GlassPane grow={1.5}>
            <StorageWidget {...osInfo.data?.storage} load={storageLoad} />
          </GlassPane>
        </FlexContainer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
