import { CpuLoad, NetworkLoad, RamLoad, StorageLoad } from 'dashdot-shared';
import { motion, Variants } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { default as styled } from 'styled-components';
import { useServerInfo } from '../api/os-info';
import GlassPane from '../components/glass-pane';
import { BACKEND_URL } from '../config/config';
import { useIsMobile } from '../services/mobile';
import { CpuWidget } from '../widgets/cpu';
import { NetworkWidget } from '../widgets/network';
import { RamWidget } from '../widgets/ram';
import { ServerWidget } from '../widgets/server';
import { StorageWidget } from '../widgets/storage';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      duration: 0.8,
    },
  },
};

const FlexContainer = styled(motion.div)<{ mobile: boolean }>`
  width: ${({ mobile }) => (mobile ? 'calc(100vw - 50px)' : '92vw')};
  min-height: ${({ mobile }) => (mobile ? 'calc(100vh - 50px)' : '86vh')};
  margin: ${({ mobile }) => (mobile ? '50px' : '7vh')} auto 0 auto;

  display: flex;
  flex-flow: row wrap;
  column-gap: 40px;
  row-gap: 70px;
`;

export const MainWidgetContainer: FC = () => {
  const isMobile = useIsMobile();

  const serverInfo = useServerInfo();
  const osData = serverInfo.data?.os;
  const cpuData = serverInfo.data?.cpu;
  const ramData = serverInfo.data?.ram;
  const networkData = serverInfo.data?.network;
  const storageData = serverInfo.data?.storage;
  const config = serverInfo.data?.config;

  const [cpuLoad, setCpuLoad] = useState<CpuLoad[]>([]);
  const [ramLoad, setRamLoad] = useState<RamLoad[]>([]);
  const [networkLoad, setNetworkLoad] = useState<NetworkLoad[]>([]);
  const [storageLoad, setStorageLoad] = useState<StorageLoad>();
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('cpu-load', data => {
      setCpuLoad(oldData => {
        if (oldData.length >= (configRef.current?.cpu_shown_datapoints ?? 0)) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on('ram-load', data => {
      setRamLoad(oldData => {
        if (oldData.length >= (configRef.current?.ram_shown_datapoints ?? 0)) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on('network-load', data => {
      setNetworkLoad(oldData => {
        if (
          oldData.length >= (configRef.current?.network_shown_datapoints ?? 0)
        ) {
          return [...oldData.slice(1), data];
        } else {
          return [...oldData, data];
        }
      });
    });

    socket.on('storage-load', data => {
      setStorageLoad(data);
    });
  }, []);

  if (!config) {
    return null;
  }

  const configs = {
    os: {
      grow: config.os_widget_grow,
      minWidth: config.os_widget_min_width,
      enabled: config.os_widget_enable,
      Widget: ServerWidget,
      data: osData,
    },
    cpu: {
      grow: config.cpu_widget_grow,
      minWidth: config.cpu_widget_min_width,
      enabled: config.cpu_widget_enable,
      Widget: CpuWidget,
      data: cpuData,
      load: cpuLoad,
    },
    storage: {
      grow: config.storage_widget_grow,
      minWidth: config.storage_widget_min_width,
      enabled: config.storage_widget_enable,
      Widget: StorageWidget,
      data: storageData,
      load: storageLoad,
    },
    ram: {
      grow: config.ram_widget_grow,
      minWidth: config.ram_widget_min_width,
      enabled: config.ram_widget_enable,
      Widget: RamWidget,
      data: ramData,
      load: ramLoad,
    },
    network: {
      grow: config.network_widget_grow,
      minWidth: config.network_widget_min_width,
      enabled: config.network_widget_enable,
      Widget: NetworkWidget,
      data: networkData,
      load: networkLoad,
    },
  };

  const widgetOrderArr = (
    config.widget_order.split(',') as (keyof typeof configs)[]
  ).filter(widget => configs[widget].enabled);

  return (
    <FlexContainer
      mobile={isMobile}
      variants={containerVariants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {widgetOrderArr.map(widget => {
        const currentConfig = configs[widget];

        return (
          <GlassPane
            key={widget}
            variants={itemVariants}
            layoutId={`widget_${widget}`}
            grow={currentConfig.grow}
            minWidth={currentConfig.minWidth}
            enableTilt={config?.enable_tilt}
          >
            <currentConfig.Widget
              // @ts-ignore
              data={currentConfig.data}
              // @ts-ignore
              load={currentConfig.load}
              config={config}
            />
          </GlassPane>
        );
      })}
    </FlexContainer>
  );
};
