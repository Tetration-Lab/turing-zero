import { Config } from "@/interfaces/config";
import { useEffect, useState } from "react";

export const useTuring = (initialConfig: Config | null) => {
  const [steps, setSteps] = useState([]);
  const [input, setInput] = useState("");
  const [currentInput, setCurrentInput] = useState(0);
  const [currentProgram, setCurrentProgram] = useState<string | null>(null);

  useEffect(() => {
    setSteps([]);
    setInput(`  ${initialConfig?.input}  ` ?? "");
    setCurrentInput(2);
    setCurrentProgram(initialConfig?.start ?? null);
  }, [initialConfig]);

  const next = () => {};

  return {
    steps,
    input,
    next,
  };
};
