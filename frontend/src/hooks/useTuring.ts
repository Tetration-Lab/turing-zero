import { Config } from "@/interfaces/config";
import { useEffect, useState } from "react";

export const useTuring = (initialConfig: Config | null) => {
  const [steps, setSteps] = useState([]);
  const [input, setInput] = useState("");
  const [currentInput, setCurrentInput] = useState(0);

  useEffect(() => {
    setSteps([]);
    setInput(initialConfig?.input ?? "");
  }, [initialConfig]);

  const next = () => {};

  return {
    steps,
    input,
    next,
  };
};
