import { default as styled, ThemeProvider } from "styled-components";
import { useColorScheme } from "use-color-scheme";
import Chart from "./components/chart";
import ChartContainer from "./components/chart-container";
import { darkTheme, lightTheme } from "./theme/theme";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
  padding-bottom: 5vh;
  background: radial-gradient(
    circle at left top,
    ${({ theme }) => theme.colors.primary} -10%,
    ${({ theme }) => theme.colors.secondary} 90%
  );
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
          <ChartContainer />
          <ChartContainer grow={2}>
            <div style={{ height: "100%", width: "100%", padding: "20px" }}>
              <Chart />
            </div>
          </ChartContainer>
          <ChartContainer />
        </FlexContainer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
