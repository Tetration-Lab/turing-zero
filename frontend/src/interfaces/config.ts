import _ from "lodash";

export type BinDigit = "0" | "1";

export interface Config {
  input: string;
  null: string;
  start: string;
  states: {
    [state: string]: {
      [key in "0" | "1" | "null"]: {
        write?: 0 | 1;
        to?: string | "halt";
        go: "left" | "right";
      };
    };
  };
}

export const parseConfig = (config: any): Config => {
  if (typeof config !== "object") {
    throw new Error("Config must be an object");
  }

  const { input, null: nullSymbol, start, states } = config;

  // check if input consists of only 0s and 1s
  if (!/^[01]+$/.test(input)) {
    throw new Error("Input must consist of only 0s and 1s");
  }

  // check if start is a valid state
  if (!states[start]) {
    throw new Error("Start state must be a valid state");
  }

  const constructedStates = Object.fromEntries(
    Object.entries(states).map(([name, state]) => {
      const allStates: [string, any][] = [];
      Object.entries(state as any).forEach(([key, v]) => {
        const value = v as any;

        // check if value is a valid state
        if (
          value?.to &&
          !(
            value.to === "halt" ||
            Object.keys(states).includes(value.to as string)
          )
        ) {
          throw new Error("Invalid state");
        }
        // check if go is valid
        if (value?.go && !["left", "right"].includes(value?.go)) {
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
          if (!["0", "1", "null", undefined].includes(sym)) {
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
    null: nullSymbol,
    start,
    states: constructedStates as any,
  };
};
