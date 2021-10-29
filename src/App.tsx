import { useMemo } from "react";
import { default as styled, ThemeProvider } from "styled-components";
import { useColorScheme } from "use-color-scheme";
import GlassPane from "./components/glass-pane";
import { darkTheme, lightTheme } from "./theme/theme";
import CpuWidget from "./widgets/cpu";
import RamWidget from "./widgets/ram";
import StorageWidget from "./widgets/storage";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
  padding-bottom: 5vh;
  background: radial-gradient(
    circle at center left,
    ${({ theme }) => theme.colors.primary} -10%,
    ${({ theme }) => theme.colors.secondary} 90%
  );

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

  const theme = useMemo(
    () => (scheme === "dark" ? darkTheme : lightTheme),
    [scheme]
  );
  const antTheme = useMemo(
    () =>
      ({
        "--ant-primary-color": theme.colors.primary,
      } as React.CSSProperties),
    [theme]
  );

  return (
    <ThemeProvider theme={theme}>
      <Container style={antTheme}>
        <FlexContainer>
          <GlassPane grow={1} />
          <GlassPane grow={2}>
            <CpuWidget />
          </GlassPane>
          <GlassPane grow={1.5}>
            <RamWidget />
          </GlassPane>
          <GlassPane grow={1.5}>
            <StorageWidget />
          </GlassPane>
        </FlexContainer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
