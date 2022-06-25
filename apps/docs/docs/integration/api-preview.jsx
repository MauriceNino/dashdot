import { useColorMode } from '@docusaurus/theme-common';
import { Input, InputWrapper, MantineProvider, Select } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

const getDataFromUrl = url => {
  const [data, setData] = useState({
    error: null,
    data: null,
    loading: false,
  });

  const requestCallback = useRef();
  const doRequest = useMemo(
    () => debounce(400, () => requestCallback.current()),
    []
  );

  useEffect(() => {
    requestCallback.current = async () => {
      setData({
        loading: true,
      });

      try {
        const fetched = await fetch(url);
        if (!fetched.ok) {
          throw Error('Request failed');
        }

        const json = await fetched.json();

        setData({
          error: null,
          data: json,
          loading: false,
        });
      } catch (e) {
        setData({
          error: e,
          loading: false,
        });
      }
    };

    doRequest();
  }, [url]);

  return data;
};

export const ApiPreview = () => {
  const { colorMode } = useColorMode();

  const [protocol, setProtocol] = useState('https');
  const [url, setUrl] = useState('dash.mauz.io');

  const baseUrl = `${protocol}://${url}`;
  const info = getDataFromUrl(baseUrl + '/info');
  const config = getDataFromUrl(baseUrl + '/config');

  return (
    <MantineProvider
      theme={{
        colorScheme: colorMode === 'dark' ? 'dark' : 'light',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            columnGap: '20px',
            rowGap: '10px',
            alignItems: 'center',
          }}
        >
          <InputWrapper label='URL'>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
              }}
            >
              <Select
                style={{ width: '100px' }}
                value={protocol}
                onChange={e => setProtocol(e)}
                data={[
                  { value: 'https', label: 'https://' },
                  { value: 'http', label: 'http://' },
                ]}
              />
              <Input value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </InputWrapper>
        </div>

        <h3>Info</h3>
        <CodeBlock className={`language-http`}>{`${baseUrl}/info`}</CodeBlock>

        <CodeBlock className={`language-json`}>
          {!info.loading
            ? !info.error
              ? JSON.stringify(info.data, null, 2)
              : info.error.message ?? 'Error'
            : 'Loading ...'}
        </CodeBlock>

        <h3>Config</h3>
        <CodeBlock className={`language-http`}>{`${baseUrl}/config`}</CodeBlock>

        <CodeBlock className={`language-json`}>
          {!config.loading
            ? !config.error
              ? JSON.stringify(config.data, null, 2)
              : config.error.message ?? 'Error'
            : 'Loading ...'}
        </CodeBlock>
      </div>
    </MantineProvider>
  );
};
