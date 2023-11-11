import { TAPE_SIZE } from "@/constants/turing";
import _ from "lodash";

export type BinDigit = "0" | "1";

export interface Config {
  input: string;
  states: {
    [state: string]: {
      [key in "0" | "1" | "empty"]: {
        write?: 0 | 1;
        transition?: string | "halt";
        move: "left" | "right";
      };
    };
  };
}

export const parseInputOutputTape = (input: bigint): string[] => {
  const out = _.range(TAPE_SIZE).map(() => " ");
  for (let i = 0; i < TAPE_SIZE; i++) {
    const digit = (input >> BigInt(i * 8)) & BigInt(0xff);
    if (digit === 1n) {
      out[i] = "0";
    } else if (digit === 2n) {
      out[i] = "1";
    }
  }
  return out;
};

export const parseConfig = (config: any): Config => {
  if (typeof config !== "object") {
    throw new Error("Config must be an object");
  }

  const { input, states } = config;

  // check if input consists of only 0s and 1s
  if (!/^[01]+$/.test(input)) {
    throw new Error("Input must consist of only 0s and 1s");
  }

  const constructedStates = Object.fromEntries(
    Object.entries(states).map(([name, state]) => {
      const allStates: [string, any][] = [];
      Object.entries(state as any).forEach(([key, v]) => {
        const value = v as any;

        // check if value is a valid state
        if (
          value?.transition &&
          !(
            value.transition === "halt" ||
            Object.keys(states).includes(value.transition as string)
          )
        ) {
          throw new Error("Invalid state");
        }
        // check if go is valid
        if (value?.move && !["left", "right"].includes(value?.move)) {
          throw new Error("Invalid go, must be left or right");
        }
        // check if write is valid
        if (value?.write !== undefined && ![0, 1].includes(value?.write)) {
          throw new Error("Invalid write, must be 0 or 1");
        }

        // check if key is list of valid symbols, if list then extract symbols
        const list = key.replaceAll("[", "").replaceAll("]", "").split(",");
        for (const s of list) {
          const sym = s.trim();
          if (!["0", "1", "empty", undefined].includes(sym)) {
            throw new Error("Invalid symbol");
          }
          allStates.push([sym, value]);
        }
      });
      return [name, Object.fromEntries(allStates)];
    })
  );

  return {
    input,
    states: constructedStates as any,
  };
};
