import qs from 'qs';
import { useMemo } from 'react';

export type FullscreenGraphTypes =
  | 'cpu'
  | 'storage'
  | 'ram'
  | 'network'
  | 'gpu';

type QueryResult =
  | {
      singleWidget: false;
    }
  | {
      singleWidget: true;
      graph: FullscreenGraphTypes;
      multiView: boolean;
      showPercentage: boolean;
      textOffset: string;
      textSize: string;
      overrideTheme?: 'light' | 'dark';
      overrideThemeColor?: string;
      overrideThemeSurface?: string;
      radius?: string;
      gap?: string;
      filter?: string;
    };

const sizeRegex = /^\d+(\.\d+)?(px|rem|em|%|vh|vw|ch|ex)$/i;
const onlyNumbersRegex = /^\d+(\.\d+)?$/;
const colorRegex =
  /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$|^rgb\(\s*\d+\s*(,\s*\d+\s*){2}\)$|^rgba\(\s*\d+\s*(,\s*\d+\s*){3}\)$|^hsl\(\s*\d+\s*(,\s*\d+%\s*){2}\)$|^hsla\(\s*\d+\s*(,\s*\d+%\s*){2},\s*[\d.]+\s*\)$/i;

const extractSizeValue = (input?: string) => {
  if (input == null) return undefined;
  if (sizeRegex.test(input)) return input;
  if (onlyNumbersRegex.test(input)) return `${input}px`;

  return undefined;
};

const extractColorValue = (input?: string) => {
  if (input == null) return undefined;
  if (colorRegex.test(input)) return input;

  return undefined;
};

export const useQuery = (): QueryResult =>
  useMemo(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (query.graph != null) {
      return {
        singleWidget: true,
        graph: query.graph as FullscreenGraphTypes,
        multiView: query.multiView === 'true',
        showPercentage: query.showPercentage === 'true',
        textOffset: extractSizeValue(query.textOffset as string) ?? '24px',
        textSize: extractSizeValue(query.textSize as string) ?? '16px',
        overrideTheme: query.theme as 'light' | 'dark',
        overrideThemeColor: extractColorValue(query.color as string),
        overrideThemeSurface: extractColorValue(query.surface as string),
        radius: extractSizeValue(query.innerRadius as string),
        gap: extractSizeValue(query.gap as string),
        filter: ((query.filter as string) ?? '').toLowerCase(),
      };
    }

    return {
      singleWidget: false,
    };
  }, []);
