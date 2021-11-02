import axios from 'axios';
import { HardwareInfo } from 'dashdot-shared';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config/config';
import { HttpResponse } from './types';

export const useOsInfo = () => {
  const [osInfo, setOsInfo] = useState<HttpResponse<HardwareInfo>>({
    loading: true,
  });

  useEffect(() => {
    axios
      .get<HardwareInfo>(`${BACKEND_URL}/system-info`)
      .then(result =>
        setOsInfo({
          loading: false,
          data: result.data,
        })
      )
      .catch(error =>
        setOsInfo({
          loading: false,
          error: error,
        })
      );
  }, []);

  return osInfo;
};
