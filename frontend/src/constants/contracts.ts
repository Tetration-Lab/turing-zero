import { Address, parseAbi } from "viem";
import { mantleTestnet, scrollSepolia } from "viem/chains";

export const CONTRACTS: { [chainId: number]: Address } = {
  [mantleTestnet.id]: "0xbf382f9c2672378a6b0e6337605a9f4ed692e617",
  [scrollSepolia.id]: "0x797e451d2e6782565db4481cf4a68c818894eeba",
};

export const getContract = (chainId: number): Address => {
  return CONTRACTS[chainId] ?? "0x0";
};

export const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
]);

export const PUZZLE_ABI = parseAbi([
  "struct TapePuzzle { address creator; uint256 startTape; uint256 endTape; string name; }",
  "function getPuzzles(uint limit, uint offset) view returns (TapePuzzle[] memory)",
  "function puzzles(uint256 id) view returns (TapePuzzle memory)",
  "function solvedPuzzles(address addr, uint256 id) view returns (bool)",
  "function createPuzzle(string calldata name, uint256 startTape, uint256 endTape) returns (uint256)",
  "function submitPuzzle(uint256 puzzleId, uint256 finalState, bytes calldata proof)",
]);
