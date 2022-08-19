import {
  CpuLoad,
  GpuLoad,
  NetworkLoad,
  RamLoad,
  ServerInfo,
  StorageLoad,
} from '@dash/common';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

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
    const socket = io(environment.backendUrl);

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
      socket = io(environment.backendUrl);

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
      text: '载入的静态数据无效或不完整！',
    },
    {
      condition: socketError,
      text: '无法连接到后台程序！',
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
