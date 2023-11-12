import { useEffect, useMemo, useState } from "react";
import { initConfigString } from "./constants/config";
import { Config, parseConfig } from "./interfaces/config";
import _ from "lodash";

export const useConfig = () => {
  const [code, setCode] = useState(initConfigString);
  const setCodeDebounced = useMemo(
    () =>
      _.debounce((value: string) => {
        setCode(value);
      }, 1000),
    []
  );

  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    try {
      const cfg = parseConfig(JSON.parse(code));
      setConfig(cfg);
    } catch (error: any) {
      console.error(error.message);
    }
  }, [code]);

  return {
    code,
    setCodeDebounced,
    config,
  };
};
