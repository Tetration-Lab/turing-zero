import { Config } from "@/interfaces/config";
import { useCallback, useEffect, useState } from "react";

export const useTuring = (initialConfig: Config | null) => {
  const [input, setInput] = useState("");
  const [currentInput, setCurrentInput] = useState(0);
  const [currentProgram, setCurrentProgram] = useState<string | "halt" | null>(
    null
  );

  const reset = useCallback(() => {
    setInput(`  ${initialConfig?.input}  ` ?? "");
    setCurrentInput(2);
    setCurrentProgram(initialConfig?.start ?? null);
  }, [initialConfig]);

  useEffect(() => {
    reset();
  }, [reset]);

  const next = useCallback(() => {
    if (currentProgram === null || currentProgram === "halt") return;
    const i = input.split("")[currentInput];
    const currentChar = i === " " ? "empty" : i;
    const currentProgramChar =
      initialConfig?.states[currentProgram][
        currentChar as "0" | "1" | "empty"
      ]!;
    if (currentProgramChar?.write !== undefined) {
      const newInput = input.split("");
      newInput[currentInput] = `${currentProgramChar.write}`;
      setInput(newInput.join(""));
    }
    if (currentProgramChar?.to !== undefined) {
      setCurrentProgram(currentProgramChar.to);
    }
    if (currentProgramChar.go === "left") {
      setCurrentInput((prev) => prev - 1);
    } else {
      setCurrentInput((prev) => prev + 1);
    }
  }, [initialConfig, currentInput, currentProgram, input]);

  const [simulating, setSimulating] = useState(false);
  useEffect(() => {
    if (currentProgram === null || currentProgram === "halt" || !simulating)
      return;
    const timeout = setTimeout(() => {
      next();
      setSimulating(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [next, currentProgram, simulating]);

  return {
    input,
    next,
    currentInput,
    currentProgram,
    reset,
    setSimulating,
  };
};
