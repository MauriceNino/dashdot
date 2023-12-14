import { ComponentProps, ComponentType, FC } from 'react';
import styled from 'styled-components';
import { usePageData } from '../services/page-data';
import { useQuery } from '../services/query-params';
import { CpuChart } from '../widgets/cpu';
import { ErrorWidget } from '../widgets/error';
import { GpuChart } from '../widgets/gpu';
import { NetworkChart } from '../widgets/network';
import { RamChart } from '../widgets/ram';
import { StorageChart } from '../widgets/storage';

const Container = styled.div<{ radius?: string; gap?: string }>`
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  > div {
    height: 100vh;
    width: 100vw;
    > div {
      height: 100vh;
      width: 100vw;
      position: relative;
      right: unset;
      bottom: unset;
      gap: ${({ gap }) => gap ?? '12px'};

      > div {
        border-radius: ${({ radius }) => radius ?? '10px'};

        > div {
          border-radius: ${({ radius }) => radius ?? '10px'};
        }

        &::before {
          box-shadow: unset;
        }
      }
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Graph<T extends ComponentType<any>> = {
  Component: T;
  props: Omit<ComponentProps<T>, 'showPercentages'>;
};

type GraphMap = {
  cpu: Graph<typeof CpuChart>;
  storage: Graph<typeof StorageChart>;
  ram: Graph<typeof RamChart>;
  network: Graph<typeof NetworkChart>;
  gpu: Graph<typeof GpuChart>;
};

export const SingleWidgetChart: FC = () => {
  const {
    pageLoaded,
    error,
    serverInfo,
    config,
    cpuLoad,
    storageLoad,
    ramLoad,
    networkLoad,
    gpuLoad,
  } = usePageData();
  const query = useQuery();

  if (error) {
    return <ErrorWidget errorText={error.text} />;
  }

  if (!pageLoaded || !config || !serverInfo || !query.singleWidget) return null;

  const configs: GraphMap = {
    cpu: {
      Component: CpuChart,
      props: {
        load: cpuLoad,
        config: config,
        multiView: query.multiView ?? false,
      },
    },
    storage: {
      Component: StorageChart,
      props: {
        load: storageLoad,
        data: serverInfo.storage,
        config: config,
        multiView: query.multiView ?? false,
      },
    },
    ram: {
      Component: RamChart,
      props: {
        load: ramLoad,
        data: serverInfo?.ram,
      },
    },
    network: {
      Component: NetworkChart,
      props: {
        load: networkLoad,
        data: serverInfo.network,
        config: config,
      },
    },
    gpu: {
      Component: GpuChart,
      props: {
        load: gpuLoad,
        index: 0,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compConfig = configs[query.graph] as Graph<any>;

  if (!compConfig) return null;

  return (
    <Container radius={query.radius} gap={query.gap}>
      <compConfig.Component
        {...compConfig.props}
        showPercentages={query.showPercentage}
        textOffset={query.textOffset}
        textSize={query.textSize}
      />
    </Container>
  );
};
