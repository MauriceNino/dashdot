import { CpuLoad, RamLoad, StorageLoad } from 'dashdot-shared';
import { FC, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { default as styled } from 'styled-components';
import { useServerInfo } from '../api/os-info';
import GlassPane from '../components/glass-pane';
import { BACKEND_URL } from '../config/config';
import { useIsMobile } from '../services/mobile';
import CpuWidget from '../widgets/cpu';
import RamWidget from '../widgets/ram';
import ServerWidget from '../widgets/server';
import StorageWidget from '../widgets/storage';

const FlexContainer = styled.div<{ mobile: boolean }>`
  width: ${({ mobile }) => (mobile ? '96vw' : '88vw')};
  min-height: ${({ mobile }) => (mobile ? '96vh' : '86vh')};
  margin: ${({ mobile }) => (mobile ? '2vh' : '7vh')} auto 0 auto;

  display: flex;
  flex-flow: row wrap;
  column-gap: 40px;
  row-gap: 50px;
`;

export const MainWidgetContainer: FC = () => {
  const isMobile = useIsMobile();

  const serverInfo = useServerInfo();
  const osData = serverInfo.data?.os;
  const cpuData = serverInfo.data?.cpu;
  const ramData = serverInfo.data?.ram;
  const storageData = serverInfo.data?.storage;
  const config = serverInfo.data?.config;

  const [cpuLoad, setCpuLoad] = useState<CpuLoad[]>([]);
  const [ramLoad, setRamLoad] = useState<RamLoad[]>([]);
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
      enabled: config.os_widget_enable,
      Widget: ServerWidget,
      data: osData,
    },
    cpu: {
      grow: config.cpu_widget_grow,
      enabled: config.cpu_widget_enable,
      Widget: CpuWidget,
      data: cpuData,
      load: cpuLoad,
    },
    ram: {
      grow: config.ram_widget_grow,
      enabled: config.ram_widget_enable,
      Widget: RamWidget,
      data: ramData,
      load: ramLoad,
    },
    storage: {
      grow: config.storage_widget_grow,
      enabled: config.storage_widget_enable,
      Widget: StorageWidget,
      data: storageData,
      load: storageLoad,
    },
  };

  const widgetOrderArr = (
    config.widget_order.split(',') as ('os' | 'cpu' | 'ram' | 'storage')[]
  ).filter(widget => configs[widget].enabled);

  return (
    <FlexContainer mobile={isMobile}>
      {widgetOrderArr.map(widget => {
        const currentConfig = configs[widget];

        return (
          <GlassPane
            key={widget}
            grow={currentConfig.grow}
            enableTilt={config?.enable_tilt}
          >
            <currentConfig.Widget
              loading={serverInfo.loading}
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
