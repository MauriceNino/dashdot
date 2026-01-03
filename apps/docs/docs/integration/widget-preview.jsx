import { useColorMode } from '@docusaurus/theme-common';
import { Group, Input, MantineProvider, Select, Stack } from '@mantine/core';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import { useFormControl } from 'react-form-ctl';

const getPart = (name, control) => {
  if (typeof control.value === 'boolean') {
    return control.value === true ? `&${name}=true` : '';
  }

  return control.value !== '' && control.value != null
    ? `&${name}=${control.value.toString()}`
    : '';
};

export const WidgetPreview = () => {
  const { colorMode } = useColorMode();

  const isDev = process.env.NODE_ENV === 'development';

  const { controls } = useFormControl({
    protocol: [isDev ? 'http' : 'https'],
    url: [isDev ? 'localhost:3000' : 'dash.mauz.dev'],
    widget: ['cpu'],
    multiView: [false],
    filterGraph: ['both'],
    showPercentage: [false],
    primaryColor: [''],
    surfaceColor: [''],
    theme: [''],
    outerRadius: [20],
    innerRadius: [null],
    gap: [null],
    textSize: [null],
    textOffset: [null],
  });

  const multiViewAllowed =
    controls.widget.value === 'cpu' || controls.widget.value === 'storage';
  const filterGraphAllowed =
    controls.widget.value === 'network' || controls.widget.value === 'gpu';

  const filterGraphOptions =
    controls.widget.value === 'network'
      ? ['both', 'up', 'down']
      : ['both', 'load', 'memory'];

  const multiViewPart = multiViewAllowed
    ? getPart('multiView', controls.multiView)
    : '';
  const showPercentagePart = getPart('showPercentage', controls.showPercentage);
  const themePart = getPart('theme', controls.theme);
  const primaryColorPart = getPart('color', controls.primaryColor);
  const surfaceColorPart = getPart('surface', controls.surfaceColor);
  const innerRadiusPart = getPart('innerRadius', controls.innerRadius);
  const gapPart = getPart('gap', controls.gap);
  const textSizePart = getPart('textSize', controls.textSize);
  const textOffsetPart = getPart('textOffset', controls.textOffset);
  const filterPart =
    filterGraphAllowed && controls.filterGraph.value !== 'both'
      ? getPart('filter', controls.filterGraph)
      : '';

  const protocol = controls.protocol.value;
  const url = controls.url.value;
  const widget = controls.widget.value;
  const outerRadius = controls.outerRadius.value;

  const finalUrl = encodeURI(
    `${protocol}://${url}?graph=${widget}${multiViewPart}${filterPart}` +
      `${showPercentagePart}${themePart}${primaryColorPart}${surfaceColorPart}` +
      `${innerRadiusPart}${gapPart}${textSizePart}${textOffsetPart}`,
  );

  const code = `<iframe
  src="${finalUrl}"${
    outerRadius != null
      ? `
  style="border-radius: ${outerRadius}px"`
      : ''
  }
  allowtransparency="true"
  frameborder="0"
></iframe>`;

  return (
    <MantineProvider
      theme={{
        colorScheme: colorMode === 'dark' ? 'dark' : 'light',
      }}
    >
      <Stack spacing="xl">
        <Stack spacing="xs">
          <h3 style={{ marginBottom: 0 }}>General</h3>
          <Group>
            <Input.Wrapper label="URL">
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                }}
              >
                <Select
                  style={{ width: '100px' }}
                  value={controls.protocol.value}
                  onChange={(e) => controls.protocol.setValue(e)}
                  data={[
                    { value: 'https', label: 'https://' },
                    { value: 'http', label: 'http://' },
                  ]}
                />
                <Input {...controls.url.inputProps()} />
              </div>
            </Input.Wrapper>

            <Select
              label="Widget"
              value={controls.widget.value}
              onChange={(e) => controls.widget.setValue(e)}
              data={[
                { value: 'cpu', label: 'CPU' },
                { value: 'storage', label: 'Storage' },
                { value: 'ram', label: 'RAM' },
                { value: 'network', label: 'Network' },
                { value: 'gpu', label: 'GPU' },
              ]}
            />

            {multiViewAllowed && (
              <Select
                label="Multi-View"
                value={controls.multiView.value.toString()}
                onChange={(e) => controls.multiView.setValue(e === 'true')}
                data={[
                  { value: 'true', label: 'True' },
                  { value: 'false', label: 'False' },
                ]}
              />
            )}
            {filterGraphAllowed && (
              <Select
                label="Filter Graph"
                value={controls.filterGraph.value.toString()}
                onChange={(e) => controls.filterGraph.setValue(e)}
                data={filterGraphOptions.map((e) => ({
                  value: e,
                  label: e.charAt(0).toUpperCase() + e.slice(1),
                }))}
              />
            )}
            <Select
              label="Show Percentage"
              value={controls.showPercentage.value.toString()}
              onChange={(e) => controls.showPercentage.setValue(e === 'true')}
              data={[
                { value: 'true', label: 'True' },
                { value: 'false', label: 'False' },
              ]}
            />
          </Group>
        </Stack>

        <Stack spacing="xs">
          <h3 style={{ marginBottom: 0 }}>Theming</h3>
          <Group>
            <Select
              label="Theme"
              value={controls.theme.value}
              onChange={(e) => controls.theme.setValue(e)}
              data={[
                { value: '', label: 'Inherit' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
            <Input.Wrapper label="Primary Color">
              <Input icon="#" {...controls.primaryColor.inputProps()} />
            </Input.Wrapper>
            <Input.Wrapper label="Surface Color">
              <Input icon="#" {...controls.surfaceColor.inputProps()} />
            </Input.Wrapper>

            <Input.Wrapper label="Outer Radius">
              <Input
                rightSection="px"
                type="number"
                {...controls.outerRadius.numberInputProps()}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Inner Radius">
              <Input
                rightSection="px"
                type="number"
                placeholder="10"
                {...controls.innerRadius.numberInputProps()}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Gap">
              <Input
                rightSection="px"
                type="number"
                placeholder="12"
                {...controls.gap.numberInputProps()}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Text Size">
              <Input
                rightSection="px"
                type="number"
                placeholder="16"
                {...controls.textSize.numberInputProps()}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Text Offset">
              <Input
                rightSection="px"
                type="number"
                placeholder="24"
                {...controls.textOffset.numberInputProps()}
              />
            </Input.Wrapper>
          </Group>
        </Stack>

        <Stack spacing="xs">
          <h3 style={{ marginBottom: 0 }}>Result</h3>
          <CodeBlock className={`language-html`}>{code}</CodeBlock>

          <iframe
            title="Preview"
            src={finalUrl}
            style={{
              borderRadius: (outerRadius ?? 0) + 'px',
              width: '100%',
              maxWidth: '300px',
            }}
          ></iframe>
        </Stack>
      </Stack>
    </MantineProvider>
  );
};
