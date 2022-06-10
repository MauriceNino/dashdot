import { ServerInfo } from '@dash/common';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { environment } from '../environments/environment';

export type HttpResponse<T> = {
  loading: boolean;
  data?: T;
  error?: any;
};

export const useServerInfo = (): [
  HttpResponse<ServerInfo>,
  () => Promise<void>
] => {
  const [serverInfo, setServerInfo] = useState<HttpResponse<ServerInfo>>({
    loading: true,
  });

  const loadStaticData = useCallback(async () => {
    setServerInfo({ loading: true });
    await axios
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

  useEffect(() => {
    loadStaticData();
  }, [loadStaticData]);

  return [serverInfo, loadStaticData];
};
