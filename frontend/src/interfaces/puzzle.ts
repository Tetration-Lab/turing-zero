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
  firstIndex: number;
  lastIndex: number;
}

export const parsePuzzleFromContract = (id: number, puzzle: any): Puzzle => {
  const inputTape = parseInputOutputTape(puzzle.startTape);
  const outputTape = parseInputOutputTape(puzzle.endTape);
  const firstOutputIndex = outputTape.findIndex((e) => e !== " ");
  const firstInputIndex = inputTape.findIndex((e) => e !== " ");
  const lastOutputIndex = outputTape.findLastIndex((e) => e !== " ") + 1;
  const lastInputIndex = inputTape.findLastIndex((e) => e !== " ") + 1;
  const firstIndex =
    firstInputIndex === -1
      ? firstOutputIndex
      : Math.min(firstInputIndex, firstOutputIndex);
  const lastIndex =
    lastInputIndex === 0
      ? lastOutputIndex
      : Math.max(lastInputIndex, lastOutputIndex);
  return {
    ...puzzle,
    inputTape,
    outputTape,
    firstIndex,
    lastIndex,
    id,
  };
};
