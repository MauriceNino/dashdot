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
    border: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#00bcd4",
    secondary: "#ff9800",
    error: "#f44336",
    warning: "#ffeb3b",
    success: "#4caf50",

    surface: "#fafafa",
    background: "#fafafa",

    text: "#212121",
    border: "#bdbdbd",
  },
};

const darkTheme: Theme = {
  dark: false,
  colors: {
    primary: "#00bcd4",
    secondary: "#ff9800",
    error: "#f44336",
    warning: "#ffeb3b",
    success: "#4caf50",

    surface: "#212121",
    background: "#212121",

    text: "#fafafa",
    border: "#bdbdbd",
  },
};

export { lightTheme, darkTheme };

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
