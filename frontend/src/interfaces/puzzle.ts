import { Address } from "viem";
import { parseInputOutputTape } from "./config";

export interface Puzzle {
  id: number;
  name: string;
  creator: Address;
  startTape: bigint;
  endTape: bigint;
  inputTape: ("0" | "1" | " ")[];
  outputTape: ("0" | "1" | " ")[];
  firstOutputIndex: number;
  lastOutputIndex: number;
}

export const parsePuzzleFromContract = (id: number, puzzle: any): Puzzle => {
  const inputTape = parseInputOutputTape(puzzle.startTape);
  const outputTape = parseInputOutputTape(puzzle.endTape);
  const firstOutputIndex = outputTape.findIndex((e) => e !== " ");
  const lastOutputIndex = outputTape.findLastIndex((e) => e !== " ") + 1;
  return {
    ...puzzle,
    inputTape,
    outputTape,
    firstOutputIndex,
    lastOutputIndex,
    id,
  };
};
