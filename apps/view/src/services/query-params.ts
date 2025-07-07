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

const sizeRegex = /^\d+\D+$/;
const extractSizeValue = (input?: string) =>
  input ? (sizeRegex.test(input) ? input : input + 'px') : undefined;

export const useQuery = (): QueryResult => {
  const query = useMemo(
    () => qs.parse(window.location.search, { ignoreQueryPrefix: true }),
    []
  );

  if (query['graph'] != null) {
    return {
      singleWidget: true,
      graph: query['graph'] as FullscreenGraphTypes,
      multiView: query['multiView'] === 'true',
      showPercentage: query['showPercentage'] === 'true',
      textOffset: extractSizeValue(query['textOffset'] as string) ?? '24px',
      textSize: extractSizeValue(query['textSize'] as string) ?? '16px',
      overrideTheme: query['theme'] as 'light' | 'dark',
      overrideThemeColor: query['color'] as string,
      overrideThemeSurface: query['surface'] as string,
      radius: extractSizeValue(query['innerRadius'] as string),
      gap: extractSizeValue(query['gap'] as string),
      filter: ((query['filter'] as string) ?? '').toLowerCase(),
    };
  }

  return {
    singleWidget: false,
  };
};
