import { N_STEP, TAPE_SIZE } from "@/constants/turing";
import { Config } from "@/interfaces/config";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";

export const useTuring = (initialConfig: Config | null) => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<("0" | "1" | " ")[]>([]);
  const [currentInput, setCurrentInput] = useState(0);
  const [currentProgram, setCurrentProgram] = useState<string | "halt" | null>(
    null
  );
  const [endInput, setEndInput] = useState<("0" | "1" | " ")[] | null>(null);
  const [initialInput, setInitialInput] = useState<("0" | "1" | " ")[] | null>(
    null
  );

  const reset = useCallback(() => {
    setStep(0);
    setEndInput(null);
    setInitialInput(null);
    const inp = _.range(TAPE_SIZE).map(() => " ");
    if (initialConfig) {
      inp.splice(
        TAPE_SIZE / 2,
        initialConfig.input.length,
        ...initialConfig.input.split("")
      );
      setInput(inp as ("0" | "1" | " ")[]);
      setInitialInput(inp as ("0" | "1" | " ")[]);
      setCurrentProgram(Object.keys(initialConfig.states)?.[0] ?? null);
      setCurrentInput(TAPE_SIZE / 2);
    }
  }, [initialConfig]);

  useEffect(() => {
    reset();
  }, [reset]);

  const next = useCallback(() => {
    if (currentProgram === null) return false;
    if (currentProgram === "halt" || step > N_STEP) {
      setEndInput([...input]);
      return false;
    }
    setStep((prev) => prev + 1);

    const i = input[currentInput];
    const currentChar = i === " " ? "empty" : i;
    const currentProgramChar =
      initialConfig?.states[currentProgram][
        currentChar as "0" | "1" | "empty"
      ]!;
    if (currentProgramChar?.write !== undefined) {
      const newInput = [...input];
      newInput[currentInput] =
        currentProgramChar.write === "empty"
          ? " "
          : `${currentProgramChar.write}`;
      setInput(newInput);
    }
    if (currentProgramChar?.transition !== undefined) {
      setCurrentProgram(currentProgramChar.transition);
    }
    if (currentProgramChar.move === "left") {
      setCurrentInput((prev) => prev - 1);
    } else {
      setCurrentInput((prev) => prev + 1);
    }
  }, [initialConfig, currentInput, currentProgram, input]);

  const [simulating, setSimulating] = useState(false);
  useEffect(() => {
    if (!simulating) {
      setSimulating(false);
      return;
    }
    const timeout = setTimeout(() => {
      const result = next();
      if (result === false) setSimulating(false);
      else setSimulating(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, [next, currentProgram, simulating, step]);

  return {
    step,
    input,
    next,
    currentInput,
    currentProgram,
    reset,
    setSimulating,
    endInput,
    initialInput,
  };
};
