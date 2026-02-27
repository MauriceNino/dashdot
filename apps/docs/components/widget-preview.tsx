'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';

const getPart = (
  name: string,
  value: string | number | boolean | null,
): string => {
  if (typeof value === 'boolean') {
    return value === true ? `&${name}=true` : '';
  }

  return value !== '' && value != null ? `&${name}=${value.toString()}` : '';
};

export const WidgetPreview = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [protocol, setProtocol] = useState('https');
  const [url, setUrl] = useState('dash.mauz.dev');
  const [widget, setWidget] = useState('cpu');
  const [multiView, setMultiView] = useState(false);
  const [filterGraph, setFilterGraph] = useState('both');
  const [showPercentage, setShowPercentage] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('');
  const [surfaceColor, setSurfaceColor] = useState('');
  const [theme, setTheme] = useState('inherit');
  const [outerRadius, setOuterRadius] = useState(20);
  const [innerRadius, setInnerRadius] = useState<number | null>(null);
  const [gap, setGap] = useState<number | null>(null);
  const [textSize, setTextSize] = useState<number | null>(null);
  const [textOffset, setTextOffset] = useState<number | null>(null);

  if (!mounted) {
    return null;
  }

  const multiViewAllowed = widget === 'cpu' || widget === 'storage';
  const filterGraphAllowed = widget === 'network' || widget === 'gpu';

  const filterGraphOptions =
    widget === 'network' ? ['both', 'up', 'down'] : ['both', 'load', 'memory'];

  const multiViewPart = multiViewAllowed ? getPart('multiView', multiView) : '';
  const showPercentagePart = getPart('showPercentage', showPercentage);
  const themePart = theme !== 'inherit' ? getPart('theme', theme) : '';
  const primaryColorPart = getPart('color', primaryColor);
  const surfaceColorPart = getPart('surface', surfaceColor);
  const innerRadiusPart = getPart('innerRadius', innerRadius);
  const gapPart = getPart('gap', gap);
  const textSizePart = getPart('textSize', textSize);
  const textOffsetPart = getPart('textOffset', textOffset);
  const filterPart =
    filterGraphAllowed && filterGraph !== 'both'
      ? getPart('filter', filterGraph)
      : '';

  const finalUrl = encodeURI(
    `${protocol}://${url}?graph=${widget}${multiViewPart}${filterPart}` +
      `${showPercentagePart}${themePart}${primaryColorPart}${surfaceColorPart}` +
      `${innerRadiusPart}${gapPart}${textSizePart}${textOffsetPart}`,
  );

  const code = `<iframe
  src="${finalUrl}"${
    outerRadius != null ? `\n  style="border-radius: ${outerRadius}px"` : ''
  }
  allowtransparency="true"
  frameborder="0"
></iframe>`;

  return (
    <Card className="w-full">
      <CardContent className="space-y-8">
        {/* General Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General</h3>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <FieldContent>
                  <div className="flex gap-2">
                    <Select value={protocol} onValueChange={setProtocol}>
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="https">https://</SelectItem>
                        <SelectItem value="http">http://</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 w-full"
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="widget">Widget</FieldLabel>
                <FieldContent>
                  <Select value={widget} onValueChange={setWidget}>
                    <SelectTrigger id="widget" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpu">CPU</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="ram">RAM</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="gpu">GPU</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="percentage">Show Percentage</FieldLabel>
                <FieldContent>
                  <Select
                    value={showPercentage.toString()}
                    onValueChange={(e) => setShowPercentage(e === 'true')}
                  >
                    <SelectTrigger id="percentage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              {multiViewAllowed && (
                <Field>
                  <FieldLabel htmlFor="multiview">Multi-View</FieldLabel>
                  <FieldContent>
                    <Select
                      value={multiView.toString()}
                      onValueChange={(e) => setMultiView(e === 'true')}
                    >
                      <SelectTrigger id="multiview" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}

              {filterGraphAllowed && (
                <Field>
                  <FieldLabel htmlFor="filter">Filter Graph</FieldLabel>
                  <FieldContent>
                    <Select value={filterGraph} onValueChange={setFilterGraph}>
                      <SelectTrigger id="filter" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterGraphOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}
            </div>
          </FieldGroup>
        </div>

        {/* Theming Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Theming</h3>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field>
                <FieldLabel htmlFor="theme">Theme</FieldLabel>
                <FieldContent>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Inherit</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="primary">Primary Color</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>#</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="primary"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="e.g., FF5733"
                      className="flex-1 w-full"
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="surface">Surface Color</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>#</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="surface"
                      value={surfaceColor}
                      onChange={(e) => setSurfaceColor(e.target.value)}
                      placeholder="e.g., 1F1F1F"
                      className="flex-1 w-full"
                    />
                  </InputGroup>
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field>
                <FieldLabel htmlFor="outerrad">Outer Radius (px)</FieldLabel>
                <FieldContent>
                  <Input
                    id="outerrad"
                    type="number"
                    value={outerRadius}
                    onChange={(e) => setOuterRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="innerrad">Inner Radius (px)</FieldLabel>
                <FieldContent>
                  <Input
                    id="innerrad"
                    type="number"
                    value={innerRadius ?? ''}
                    onChange={(e) =>
                      setInnerRadius(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="10"
                    className="w-full"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="gap">Gap (px)</FieldLabel>
                <FieldContent>
                  <Input
                    id="gap"
                    type="number"
                    value={gap ?? ''}
                    onChange={(e) =>
                      setGap(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="12"
                    className="w-full"
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="textsize">Text Size (px)</FieldLabel>
                <FieldContent>
                  <Input
                    id="textsize"
                    type="number"
                    value={textSize ?? ''}
                    onChange={(e) =>
                      setTextSize(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="16"
                    className="w-full"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="textoffset">Text Offset (px)</FieldLabel>
                <FieldContent>
                  <Input
                    id="textoffset"
                    type="number"
                    value={textOffset ?? ''}
                    onChange={(e) =>
                      setTextOffset(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="24"
                    className="w-full"
                  />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </div>

        {/* Result Section */}
        <div className="space-y-8">
          <h3 className="text-lg font-semibold">Result</h3>
          <div>
            <pre className="p-4 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
              {code}
            </pre>
          </div>

          <div className="flex justify-center">
            <iframe
              className='h-75 w-full'
              title="Widget Preview"
              src={finalUrl}
              style={{
                borderRadius: `${outerRadius ?? 0}px`,
              }}
              allowTransparency={true}
              frameBorder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
