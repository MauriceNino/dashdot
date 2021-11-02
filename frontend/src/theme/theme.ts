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
    primary: '#5ee2ff',
    secondary: '#f5a4e3',
    error: '#f44336',

    surface: '#fafafa',
    background: '#d9d9d9',

    text: '#404040',

    cpuPrimary: '#52d7ff',
    ramPrimary: '#ff526f',
    storagePrimary: '#49e37a',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#775a9e',
    secondary: '#434047',
    error: lightTheme.colors.error,

    surface: '#212121',
    background: '#4f4f4f',

    text: '#fafafa',

    cpuPrimary: '#2259b3',
    ramPrimary: '#c43148',
    storagePrimary: '#22b352',
  },
};

export { lightTheme, darkTheme };

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
