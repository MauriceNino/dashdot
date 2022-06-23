import qs from 'qs';
import { useMemo } from 'react';

export type FullscreenGraphTypes =
  | 'cpu'
  | 'storage'
  | 'ram'
  | 'network_up'
  | 'network_down'
  | 'gpu_memory'
  | 'gpu_usage';

type QueryResult =
  | {
      isSingleGraphMode: false;
    }
  | {
      isSingleGraphMode: true;
      graph: FullscreenGraphTypes;
      multiView?: boolean;
      overrideTheme?: 'light' | 'dark';
      overrideThemeColor?: string;
      overrideThemeSurface?: string;
    };

export const useQuery = (): QueryResult => {
  const query = useMemo(
    () => qs.parse(window.location.search, { ignoreQueryPrefix: true }),
    []
  );

  if (query['singleGraphMode'] === 'true') {
    return {
      isSingleGraphMode: true,
      graph: query['graph'] as FullscreenGraphTypes,
      multiView: query['multiView'] === 'true',
      overrideTheme: query['theme'] as 'light' | 'dark',
      overrideThemeColor: query['color'] as string,
      overrideThemeSurface: query['surface'] as string,
    };
  }

  return {
    isSingleGraphMode: false,
  };
};
