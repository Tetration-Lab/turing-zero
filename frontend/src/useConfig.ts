import { useCallback, useEffect, useMemo, useState } from "react";
import { Config, parseConfig } from "./interfaces/config";
import _ from "lodash";
import { useToast } from "@chakra-ui/react";
import {
  AUTO_LOAD,
  AUTO_LOAD_INTERVAL,
  INIT_CONFIG_STRING,
} from "./constants/config";

export const useConfig = ({ autoLoad }: { autoLoad: boolean }) => {
  const toast = useToast();

  const [code, setCode] = useState(INIT_CONFIG_STRING);
  const [tmpCode, setTmpCode] = useState(INIT_CONFIG_STRING);
  const [config, setConfig] = useState<Config | null>(null);

  const setCodeDebounced = useMemo(
    () =>
      _.debounce((value: string) => {
        setTmpCode(value);
      }, AUTO_LOAD_INTERVAL),
    []
  );

  useEffect(() => {
    try {
      const cfg = parseConfig(JSON.parse(code));
      if (!AUTO_LOAD)
        toast({
          title: "Success",
          description: "Config loaded",
          status: "success",
        });
      setConfig(cfg);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
      console.error(error.message);
    }
  }, [code]);

  useEffect(() => {
    if (autoLoad) setCode(tmpCode);
  }, [tmpCode, autoLoad]);

  const load = useCallback(() => {
    setCode(tmpCode);
  }, [tmpCode]);

  return {
    code,
    setCodeDebounced,
    config,
    load,
  };
};
