type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    error: string;
    warning: string;
    success: string;

    surface: string;
    background: string;

    text: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#00c5d4",
    secondary: "#c400ff",
    error: "#f44336",
    warning: "#ffeb3b",
    success: "#4caf50",

    surface: "#fafafa",
    background: "#fafafa",

    text: "#212121",
  },
};

const darkTheme: Theme = {
  dark: false,
  colors: {
    primary: "#0086d4",
    secondary: "#9a28bd",
    error: lightTheme.colors.error,
    warning: lightTheme.colors.warning,
    success: lightTheme.colors.success,

    surface: "#212121",
    background: "#212121",

    text: "#fafafa",
  },
};

export { lightTheme, darkTheme };

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
