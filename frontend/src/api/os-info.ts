import axios from 'axios';
import { ServerInfo } from 'dashdot-shared';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config/config';

export type HttpResponse<T> = {
  loading: boolean;
  data?: T;
  error?: any;
};

export const useServerInfo = () => {
  const [serverInfo, setServerInfo] = useState<HttpResponse<ServerInfo>>({
    loading: true,
  });

  useEffect(() => {
    axios
      .get<ServerInfo>(`${BACKEND_URL}/system-info`)
      .then(result =>
        setServerInfo({
          loading: false,
          data: result.data,
        })
      )
      .catch(error =>
        setServerInfo({
          loading: false,
          error: error,
        })
      );
  }, []);

  return serverInfo;
};
