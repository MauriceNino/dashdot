import { default as styled, ThemeProvider } from "styled-components";
import { useColorScheme } from "use-color-scheme";
import { darkTheme, lightTheme } from "./theme/theme";

const Container = styled.div`
  overflow: auto;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.background};
`;

function App() {
  const { scheme } = useColorScheme();

  return (
    <ThemeProvider theme={scheme === "dark" ? darkTheme : lightTheme}>
      <Container></Container>
    </ThemeProvider>
  );
}

export default App;
