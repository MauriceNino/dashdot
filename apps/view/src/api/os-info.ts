import { ServerInfo } from '@dash/common';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { environment } from '../environments/environment';

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
      .get<ServerInfo>(`${environment.backendUrl}/system-info`)
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
