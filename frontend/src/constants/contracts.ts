import { Address, parseAbi } from "viem";
import { mantleTestnet } from "viem/chains";

export const CONTRACTS: { [chainId: number]: Address } = {
  [mantleTestnet.id]: "0xbf382f9c2672378a6b0e6337605a9f4ed692e617",
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
  "function createPuzzle(string calldata name, uint256 startTape, uint256 endTape) returns (uint256)",
  "function submitPuzzle(uint256 puzzleId, uint256 finalState, bytes calldata proof)",
]);
