import {
  CHAR_SIZE,
  N_STEP,
  TAPE_SIZE,
  TOTAL_STATE_SIZE,
} from "@/constants/turing";
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

export const parseInputOutputTape = (input: bigint): ("0" | "1" | " ")[] => {
  const out = _.range(TAPE_SIZE).map(() => " ");
  for (let i = 0; i < TAPE_SIZE; i++) {
    const digit = (input >> BigInt(i * 8)) & BigInt(0xff);
    if (digit === 1n) {
      out[i] = "0";
    } else if (digit === 2n) {
      out[i] = "1";
    }
  }
  return out as ("0" | "1" | " ")[];
};

export const toWitness = (config: Config) => {
  const tapeInit = _.range(0, TAPE_SIZE).map(() => 0);
  const configInit = config.input.split("").map((c) => parseInt(c) + 1);
  tapeInit.splice(TAPE_SIZE / 2, configInit.length, ...configInit);
  const write = _.range(0, TOTAL_STATE_SIZE).map(() => 0);
  const move = _.range(0, TOTAL_STATE_SIZE).map(() => 1);
  const stateTransition = _.range(0, 30).map(() => 0);

  const haltIndex = Object.keys(config.states).length;

  // config states
  Object.entries(config.states).forEach(([name, state], i) => {
    Object.entries(state).forEach(([char, transition]) => {
      const c = char.trim();
      const charIndex = c === "0" ? 1 : c === "1" ? 2 : 0;
      if (transition.write !== undefined) {
        write[i * CHAR_SIZE + charIndex] = transition.write + 1;
      } else {
        write[i * CHAR_SIZE + charIndex] = charIndex;
      }
      if (transition.move === "right") {
        move[i * CHAR_SIZE + charIndex] = 0;
      } else {
        move[i * CHAR_SIZE + charIndex] = 2;
      }
      if (transition?.transition === "halt") {
        stateTransition[i * CHAR_SIZE + charIndex] = haltIndex;
      } else {
        stateTransition[i * CHAR_SIZE + charIndex] = _.indexOf(
          Object.keys(config.states),
          transition.transition ?? name
        );
      }
    });
  });

  // config halt state
  write.splice(haltIndex * CHAR_SIZE, CHAR_SIZE, 0, 1, 2);
  move.splice(haltIndex * CHAR_SIZE, CHAR_SIZE, 1, 1, 1);
  stateTransition.splice(
    haltIndex * CHAR_SIZE,
    CHAR_SIZE,
    haltIndex,
    haltIndex,
    haltIndex
  );

  const tapeOut = [...tapeInit];
  let head = TAPE_SIZE / 2;
  let state = 0;

  // handle tape out
  _.range(N_STEP).forEach(() => {
    const read = tapeOut[head];
    const transitionIndex = state * CHAR_SIZE + read;
    tapeOut[head] = write[transitionIndex];
    const mv = move[transitionIndex];
    head = head + 1 - mv;
    state = stateTransition[transitionIndex];
  });

  let start = 0n;
  for (let i = 0; i < TAPE_SIZE; i++) {
    start += BigInt(tapeInit[i]) << BigInt(i * 8);
  }
  let end = 0n;
  for (let i = 0; i < TAPE_SIZE; i++) {
    end += BigInt(tapeOut[i]) << BigInt(i * 8);
  }

  return {
    tapeInit,
    tapeOut,
    write,
    move,
    stateTransition,
    state,
    start,
    end,
  };
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
