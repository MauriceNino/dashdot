export const environment =
  import.meta.env.MODE === 'production'
    ? {
        production: true,
        backendUrl: window.location.origin,
      }
    : {
        production: false,
        backendUrl: 'http://localhost:3001',
      };
