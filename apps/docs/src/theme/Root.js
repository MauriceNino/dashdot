import { MantineProvider } from '@mantine/core';
import React from 'react';

export default function Root({ children }) {
  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
      }}
    >
      {children}
    </MantineProvider>
  );
}
