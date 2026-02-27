'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FetchData {
  error: Error | null;
  data: unknown;
  loading: boolean;
}

const getDataFromUrl = (url: string): FetchData => {
  const [data, setData] = useState<FetchData>({
    error: null,
    data: null,
    loading: false,
  });

  const requestCallback = useRef<(() => void) | null>(null);
  const doRequest = useMemo(
    () => debounce(400, () => requestCallback.current?.()),
    [],
  );

  useEffect(() => {
    requestCallback.current = async () => {
      setData({
        error: null,
        data: null,
        loading: true,
      });

      try {
        const fetched = await fetch(url);
        if (!fetched.ok) {
          throw Error('Request failed');
        }

        const json = await fetched.json();

        setData({
          error: null,
          data: json,
          loading: false,
        });
      } catch (e) {
        setData({
          error: e instanceof Error ? e : new Error(String(e)),
          data: null,
          loading: false,
        });
      }
    };

    doRequest();
  }, [url, doRequest]);

  return data;
};

export const ApiPreview = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [protocol, setProtocol] = useState('https');
  const [url, setUrl] = useState('dash.mauz.dev');

  const baseUrl = `${protocol}://${url}`;
  const info = getDataFromUrl(`${baseUrl}/info`);
  const config = getDataFromUrl(`${baseUrl}/config`);
  const cpuLoad = getDataFromUrl(`${baseUrl}/load/cpu`);
  const storageLoad = getDataFromUrl(`${baseUrl}/load/storage`);
  const ramLoad = getDataFromUrl(`${baseUrl}/load/ram`);
  const networkLoad = getDataFromUrl(`${baseUrl}/load/network`);
  const gpuLoad = getDataFromUrl(`${baseUrl}/load/gpu`);

  const formatOutput = (data: FetchData): string => {
    return !data.loading
      ? !data.error
        ? JSON.stringify(data.data, null, 2)
        : data.error.message ?? 'Error'
      : 'Loading ...';
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration</h3>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2 mt-2">
                <Select value={protocol} onValueChange={setProtocol}>
                  <SelectTrigger className="w-fit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="https">https://</SelectItem>
                    <SelectItem value="http">http://</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="dash.mauz.dev"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Info</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/info`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(info)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Config</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/config`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(config)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">CPU Load</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/load/cpu`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(cpuLoad)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Storage Load</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/load/storage`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(storageLoad)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">RAM Load</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/load/ram`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(ramLoad)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Network Load</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/load/network`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(networkLoad)}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">GPU Load</h3>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto">
            {`${baseUrl}/load/gpu`}
          </pre>
          <pre className="p-3 rounded-md border bg-muted text-muted-foreground text-sm overflow-x-auto max-h-96">
            {formatOutput(gpuLoad)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
