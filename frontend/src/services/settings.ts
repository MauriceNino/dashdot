import { Dispatch, useEffect, useState } from "react";
import store from "store";

type Settings = {
  darkMode?: boolean;
};

export const setSettings = <T extends keyof Settings = keyof Settings>(
  property: T,
  value: Settings[T]
) => {
  store.set(property, value);
};

export const getSettings = <T extends keyof Settings = keyof Settings>(
  property: T
) => {
  return store.get(property) as Settings[T];
};

const ALL_DISPATCHES: {
  [T in keyof Settings]: Dispatch<Settings[T]>[];
} = {};

export const useSetting = <T extends keyof Settings = keyof Settings>(
  key: T,
  initialValue?: Settings[T]
): [Settings[T], Dispatch<Settings[T]>] => {
  const [localValue, setLocalValue] = useState<Settings[T]>(
    () => getSettings(key) ?? initialValue
  );

  const setSetting = (newValue: Settings[T]) => {
    ALL_DISPATCHES[key]!.forEach((dispatch) => dispatch(newValue));
    setSettings(key, newValue);
  };

  useEffect(() => {
    ALL_DISPATCHES[key] = ALL_DISPATCHES[key] ?? [];
    ALL_DISPATCHES[key]!.push(setLocalValue);

    if (initialValue !== undefined) {
      setSetting(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [localValue, setSetting];
};
