type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    error: string;

    surface: string;
    background: string;

    text: string;

    cpuPrimary: string;
    ramPrimary: string;
    storagePrimary: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#56e3e8",
    secondary: "#e683da",
    error: "#f44336",

    surface: "#fafafa",
    background: "#fafafa",

    text: "#212121",

    cpuPrimary: "#52d7ff",
    ramPrimary: "#ff526f",
    storagePrimary: "#49e37a",
  },
};

const darkTheme: Theme = {
  dark: false,
  colors: {
    primary: "#775a9e",
    secondary: "#434047",
    error: lightTheme.colors.error,

    surface: "#212121",
    background: "#212121",

    text: "#fafafa",

    cpuPrimary: "#2259b3",
    ramPrimary: "#c43148",
    storagePrimary: "#22b352",
  },
};

export { lightTheme, darkTheme };

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
