import { FC } from 'react';
import styled from 'styled-components';
import { usePageData } from '../services/page-data';
import { useQuery } from '../services/query-params';
import { CpuChart } from '../widgets/cpu';
import { ErrorWidget } from '../widgets/error';
import { GpuChart } from '../widgets/gpu';
import { NetworkChart } from '../widgets/network';
import { RamChart } from '../widgets/ram';
import { StorageChart } from '../widgets/storage';

const Container = styled.div`
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
      > div {
        border-radius: 0;

        &::before {
          box-shadow: unset;
        }
      }
    }
  }
`;

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

  if (!pageLoaded || !config || !query.isSingleGraphMode) return null;

  const configs = {
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
        data: serverInfo?.storage,
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
        data: serverInfo?.network,
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

  const compConfig = configs[query.graph as keyof typeof configs];

  if (!compConfig) return null;

  return (
    <Container>
      {/*@ts-ignore */}
      <compConfig.Component {...compConfig.props} />
    </Container>
  );
};
