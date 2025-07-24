import {
  CpuLoad,
  GpuLoad,
  NetworkLoad,
  RamLoad,
  ServerInfo,
  StorageLoad,
} from '@dash/common';
import { useEffect, useState } from 'react';
import { URL } from 'url';
import Path from 'path';
import { Socket, io } from 'socket.io-client';
import { environment } from '../environment';

const getFullyQualifiedSocket = (): Socket => {
    const { origin: wlOrigin, pathname: wlPathname } = window.location;
    return io(environment.backendUrl, {
      path: new URL(Path.join(wlOrigin, wlPathname, '/socket')).pathname,
    });
}

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
    const socket = getFullyQualifiedSocket();

    socket.on('static-info', data => {
      setServerInfo(data);
    });

    socket.on('connect', () => {
      setTimeout(() => setPageLoaded(true), 50);
      setSocketError(false);
    });
    socket.on('connect_error', () => {
      setSocketError(true);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    let socket: Socket | undefined;
    if (config) {
      socket = getFullyQualifiedSocket();

      socket.on('cpu-load', data => {
        setCpuLoad(oldData => {
          if (oldData.length >= (config.cpu_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
      });

      socket.on('ram-load', data => {
        setRamLoad(oldData => {
          if (oldData.length >= (config.ram_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
      });

      socket.on('network-load', data => {
        setNetworkLoad(oldData => {
          if (oldData.length >= (config.network_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
      });

      socket.on('gpu-load', data => {
        setGpuLoad(oldData => {
          if (oldData.length >= (config.gpu_shown_datapoints ?? 0)) {
            return [...oldData.slice(1), data];
          } else {
            return [...oldData, data];
          }
        });
      });

      socket.on('storage-load', data => {
        setStorageLoad(data);
      });
    }

    return () => {
      socket?.close();
    };
  }, [config]);

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
  const error = errors.find(e => e.condition && pageLoaded === true);

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
