import {
  CpuLoad,
  GpuLoad,
  NetworkLoad,
  RamLoad,
  ServerInfo,
  StorageLoad,
} from '@dash/common';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { URL } from 'url';
import * as Path from 'path';
import { environment } from '../environment';

export const usePageData = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [socketError, setSocketError] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerInfo | undefined>();
  const [cpuLoad, setCpuLoad] = useState<CpuLoad[]>([]);
  const [ramLoad, setRamLoad] = useState<RamLoad[]>([]);
  const [networkLoad, setNetworkLoad] = useState<NetworkLoad[]>([]);
  const [gpuLoad, setGpuLoad] = useState<GpuLoad[]>([]);
  const [storageLoad, setStorageLoad] = useState<StorageLoad>();

  const config = serverInfo?.config;

  useEffect(() => {
    const { origin: wlOrigin, pathname: wlPathname } = window.location;
    const socket = io(environment.backendUrl, {
      path: new URL(Path.join(wlOrigin, wlPathname, '/socket')).pathname,
    });
    let localConfig: ServerInfo['config'];

    socket.on('static-info', data => {
      setServerInfo(data);
      localConfig = data.config;
    });

    socket.on('connect', () => {
      setTimeout(() => setPageLoaded(true), 50);
      setSocketError(false);
    });
    socket.on('connect_error', () => {
      setTimeout(() => setPageLoaded(true), 50);
      setSocketError(true);
    });

    socket.on('cpu-load', data => {
      if (localConfig)
        setCpuLoad(oldData => {
          if (oldData.length >= (localConfig.cpu_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
    });

    socket.on('ram-load', data => {
      if (localConfig)
        setRamLoad(oldData => {
          if (oldData.length >= (localConfig.ram_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
    });

    socket.on('network-load', data => {
      if (localConfig)
        setNetworkLoad(oldData => {
          if (oldData.length >= (localConfig.network_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
    });

    socket.on('gpu-load', data => {
      if (localConfig)
        setGpuLoad(oldData => {
          if (oldData.length >= (localConfig.gpu_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
    });

    socket.on('storage-load', data => {
      setStorageLoad(data);
    });

    return () => {
      socket?.close();
    };
  }, []);

  const errors = [
    {
      condition: !config,
      text: 'Invalid or incomplete static data loaded!',
    },
    {
      condition: socketError,
      text: 'Unable to connect to backend!',
    },
  ];
  const error = errors.find(e => e.condition && pageLoaded);

  return {
    pageLoaded,
    error,
    serverInfo,
    config,
    cpuLoad,
    ramLoad,
    networkLoad,
    gpuLoad,
    storageLoad,
  };
};
