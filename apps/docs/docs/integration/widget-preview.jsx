import { Checkbox, Input, Select } from '@mantine/core';
import React, { useState } from 'react';

export const WidgetPreview = () => {
  const [protocol, setProtocol] = useState('https');
  const [url, setUrl] = useState('dash.mauz.io');
  const [widget, setWidget] = useState('cpu');
  const [multiView, setMultiView] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('');
  const [surfaceColor, setSurfaceColor] = useState('');

  const multiViewAllowed = widget === 'cpu' || widget === 'storage';
  const finalUrl = `${protocol}://${url}?singleGraphMode=true&graph=${widget}${
    multiViewAllowed ? `&multiView=${multiView.toString()}` : ''
  }${primaryColor !== '' ? `&color=${primaryColor}` : ''}${
    surfaceColor !== '' ? `&surface=${surfaceColor}` : ''
  }`;

  return (
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
        }}
      >
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
          <Input
            placeholder='Primary Color'
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>

        <Select
          value={widget}
          onChange={e => setWidget(e)}
          data={[
            { value: 'cpu', label: 'CPU' },
            { value: 'storage', label: 'Storage' },
            { value: 'ram', label: 'RAM' },
            { value: 'network', label: 'Network' },
            { value: 'gpu', label: 'GPU' },
          ]}
        />

        {multiViewAllowed && (
          <Checkbox
            label='Multi-View'
            checked={multiView}
            onChange={e => setMultiView(e.target.checked)}
          />
        )}

        <Input
          placeholder='Primary Color'
          icon='#'
          value={primaryColor}
          onChange={e => setPrimaryColor(e.target.value)}
        />

        <Input
          placeholder='Surface Color'
          icon='#'
          value={surfaceColor}
          onChange={e => setSurfaceColor(e.target.value)}
        />
      </div>

      <code>{finalUrl}</code>

      <iframe
        src={finalUrl}
        style={{
          borderRadius: '20px',
          width: '100%',
          maxWidth: '300px',
        }}
      ></iframe>
    </div>
  );
};
