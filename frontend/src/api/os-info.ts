import axios from "axios";
import { HardwareInfo } from "dashdot-shared";
import { useEffect, useState } from "react";
import { HttpResponse } from "./types";

export const useOsInfo = () => {
  const [osInfo, setOsInfo] = useState<HttpResponse<HardwareInfo>>({
    loading: true,
  });

  useEffect(() => {
    axios
      .get<HardwareInfo>("http://localhost:3001/system-info")
      .then((result) =>
        setOsInfo({
          loading: false,
          data: result.data,
        })
      )
      .catch((error) =>
        setOsInfo({
          loading: false,
          error: error,
        })
      );
  }, []);

  return osInfo;
};
